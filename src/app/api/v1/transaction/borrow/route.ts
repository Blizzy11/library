import pagination from "@/helper/helper";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { userId, itemId, description, borrowDate, returnDate } =
    await request.json();

  // check if item is available
  const item = await prisma.item.findFirst({
    where: {
      id: itemId,
      availability: "AVAILABLE",
    },
  });
  if (!item) {
    return NextResponse.json(
      {
        message: "Item is not available now",
      },
      { status: 404 }
    );
  }

  // check if user has borrowed the item
  const borrowedItem = await prisma.borrow.findFirst({
    where: {
      itemId: itemId,
      userId: userId,
      status: "PENDING",
    },
  });

  if (borrowedItem) {
    return NextResponse.json(
      {
        message: "You have already borrowed this item",
      },
      {
        status: 404,
      }
    );
  }

  // create borrow numbering format BRR-YYYYMMDD-0001
  // get last borrow number
  const lastBorrowNumber = await prisma.borrow.findFirst({
    where: {
      createdAt: {
        gte: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        ),
        lt: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() + 1
        ),
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  // increment borrow number if last borrow number exists
  const borrowNumber =
    lastBorrowNumber && lastBorrowNumber.id
      ? `BRR-${lastBorrowNumber.borrowNumber.split("-")[1]}-${String(
          parseInt(lastBorrowNumber.borrowNumber.split("-")[2]) + 1
        ).padStart(4, "0")}`
      : `BRR-${new Date().getFullYear()}${(new Date().getMonth() + 1)
          .toString()
          .padStart(2, "0")}${new Date()
          .getDate()
          .toString()
          .padStart(2, "0")}-0001`;

  const borrow = await prisma.borrow.create({
    data: {
      userId,
      itemId,
      borrowNumber,
      borrowDate,
      returnDate,
      description,
    },
  });

  if (borrow) {
    return NextResponse.json({
      message: "Borrow created successfully",
      data: borrow,
    });
  } else {
    return NextResponse.json({
      message: "Something went wrong",
    });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const borrowId = searchParams.get("borrowId");
  const pageNumber = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("limit") || "10");
  const searchTerm = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  // if role user
  const bookOwnerId = searchParams.get("bookOwnerId");

  const offset = (pageNumber - 1) * pageSize;

  let whereClause: Record<string, any> = {};

  if (userId) {
    whereClause = {
      ...whereClause,
      userId,
    };
  }

  if (borrowId) {
    whereClause = {
      ...whereClause,
      id: borrowId,
    };
  }

  if (status && status !== "ALL") {
    whereClause = {
      ...whereClause,
      status,
    };
  }

  if (bookOwnerId) {
    whereClause = {
      ...whereClause,
      item: {
        createdBy: bookOwnerId,
      },
    };
  }

  if (searchTerm) {
    whereClause = {
      ...whereClause,
      OR: [
        { borrowNumber: { contains: searchTerm } },
        { description: { contains: searchTerm } },
        {
          item: {
            name: {
              contains: searchTerm,
            },
          },
        },
      ],
    };
  }

  const borrow = await prisma.borrow.findMany({
    skip: offset,
    take: pageSize,
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      item: true,
      user: true,
    },
  });

  // pagination
  const totalData = await prisma.borrow.count({ where: whereClause });
  const totalPage = Math.ceil(totalData / pageSize);
  const isPagination = pagination(totalData, totalPage);

  return NextResponse.json({
    message: "Borrow fetched successfully",
    data: borrow,
    pagination: isPagination,
  });
}
