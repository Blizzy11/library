import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { transactionId } = await request.json();
  if (!transactionId) {
    return NextResponse.json(
      {
        message: "transactionId not found",
      },
      { status: 400 }
    );
  }
  const isTransaction = await prisma.borrow.findUnique({
    where: {
      id: transactionId,
    },
  });
  if (!isTransaction) {
    return NextResponse.json(
      {
        message: "Transaction not found",
      },
      { status: 404 }
    );
  }

  const declineTransaction = await prisma.borrow.update({
    where: {
      id: transactionId,
    },
    data: {
      status: "REJECTED",
    },
  });
  return NextResponse.json({
    message: "Transaction declined",
    data: declineTransaction,
  });
}
