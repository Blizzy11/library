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

  if (isTransaction.status == "RETURNED") {
    return NextResponse.json(
      {
        message: "Transaction already returned",
      },
      { status: 400 }
    );
  }

  const transaction = await prisma.borrow.update({
    where: {
      id: transactionId,
    },
    data: {
      status: "RETURNED",
    },
    select: {
      id: true,
      status: true,
      itemId: true,
      userId: true,
    },
  });

  if (!transaction) {
    return NextResponse.json(
      {
        message: "Transaction not found",
      },
      { status: 404 }
    );
  } else {
    const item = await prisma.item.update({
      where: {
        id: transaction.itemId,
      },
      data: {
        availability: "AVAILABLE",
      },
    });

    return NextResponse.json({
      message: "Item returned successfully",
      transaction,
    });
  }
}
