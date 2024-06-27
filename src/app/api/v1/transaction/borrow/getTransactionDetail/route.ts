import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const borrowId = searchParams.get("borrowId");

  if (!borrowId) {
    return NextResponse.json(
      {
        message: "borrowId is required",
      },
      { status: 400 }
    );
  }

  const borrow = await prisma.borrow.findUnique({
    where: {
      id: borrowId as string,
    },
    include: {
      Item: true,
      User: true,
    },
  });

  if (!borrow) {
    return NextResponse.json(
      {
        message: "Borrow not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Borrow fetched successfully",
    data: borrow,
  });
}
