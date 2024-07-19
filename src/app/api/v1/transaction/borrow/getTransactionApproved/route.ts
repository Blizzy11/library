import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const itemId = searchParams.get("itemId");
  const pageNumber = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("limit") || "10");
  const searchTerm = searchParams.get("search") || "";
  const offset = (pageNumber - 1) * pageSize;

  let whereClause: Record<string, any> = {
    status: {
      in: ["APPROVED", "RETURNED"],
    },
  };

  if (userId) {
    whereClause = {
      ...whereClause,
      userId,
    };
  }

  if (itemId) {
    whereClause = {
      ...whereClause,
      itemId,
    };
  }

  const transaction = await prisma.borrow.findFirst({
    where: whereClause,
    include: {
      item: true,
      user: true,
    },
    orderBy: {
      returnDate: "desc",
    },
    skip: offset,
    take: pageSize,
  });

  return NextResponse.json(transaction);
}
