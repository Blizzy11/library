import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { transactionId, approvedAt } = await request.json();

  if (!transactionId) {
    return NextResponse.json(
      {
        message: "Transaction ID is required",
      },
      { status: 400 }
    );
  }

  // check if item is available
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

  const isItemAvailable = await prisma.item.findUnique({
    where: {
      id: isTransaction.itemId,
    },
  });

  if (isItemAvailable?.availability != "AVAILABLE") {
    return NextResponse.json(
      {
        message: "Item is not available",
      },
      { status: 400 }
    );
  }

  if (isTransaction.status == "APPROVED") {
    return NextResponse.json(
      {
        message: "Transaction already approved",
      },
      { status: 400 }
    );
  }

  const transaction = await prisma.borrow.update({
    where: {
      id: transactionId,
    },
    data: {
      status: "APPROVED",
      approvedAt,
    },
  });

  const updateItem = await prisma.item.update({
    where: {
      id: isTransaction.itemId,
    },
    data: {
      availability: "BORROWED",
    },
  });

  if (transaction && updateItem) {
    return NextResponse.json(
      {
        message: "Transaction approved",
      },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      {
        message: "Transaction failed",
      },
      { status: 500 }
    );
  }
}
