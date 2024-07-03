import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");

  console.log("userId");

  if (!userId) {
    return NextResponse.json(
      {
        message: "userId is required",
      },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
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
      message: "User fetched successfully",
      data: user,
    });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const { username, email, phone_number, name } = await request.json();
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
