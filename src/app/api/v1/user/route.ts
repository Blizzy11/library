import pagination from "@/helper/helper";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const pageNumber = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("limit") || "10");
  const searchTerm = searchParams.get("search") || "";
  const userId = searchParams.get("userId");
  const status = searchParams.get("status") || "";
  const role = searchParams.get("role") || "";

  const offset = (pageNumber - 1) * pageSize;

  let whereClause: Record<string, any> = {};

  if (userId) {
    whereClause = {
      ...whereClause,
      id: userId,
    };
  }

  if (role) {
    whereClause = {
      ...whereClause,
      role,
    };
  }

  if (status && status !== "ALL") {
    whereClause = {
      ...whereClause,
      is_active: status === "active" ? true : false,
    };
  }

  if (searchTerm) {
    whereClause = {
      ...whereClause,
      OR: [
        { username: { contains: searchTerm } },
        { name: { contains: searchTerm } },
        { email: { contains: searchTerm } },
        { phone: { contains: searchTerm } },
      ],
    };
  }

  const user = await prisma.user.findMany({
    skip: offset,
    take: pageSize,
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
  });

  // pagination
  const totalData = await prisma.user.count({ where: whereClause });
  const totalPage = Math.ceil(totalData / pageSize);
  const isPagination = pagination(totalData, totalPage);

  return NextResponse.json({
    message: "User fetched successfully",
    data: user,
    pagination: isPagination,
  });
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const { username, email, phone_number, name, birthDate } =
    await request.json();

  if (!userId) {
    return NextResponse.json(
      {
        message: "userId is required",
      },
      { status: 400 }
    );
  }

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username,
      email,
      name,
      phone: phone_number,
      birthDate,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        message: "User not found",
      },
      { status: 404 }
    );
  } else {
    return NextResponse.json({
      message: "User updated successfully",
      data: user,
    });
  }
}
