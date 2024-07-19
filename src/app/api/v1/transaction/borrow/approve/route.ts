import { generateTransactionMessage, sendMessage } from "@/helper/helper";
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

  // check if start date greater then return date last approved or return transaction
  const lastTransaction = await prisma.borrow.findFirst({
    where: {
      itemId: isTransaction.itemId,
      status: {
        in: ["APPROVED", "RETURNED"],
      },
    },
    orderBy: {
      returnDate: "desc",
    },
  });

  if (
    lastTransaction &&
    isTransaction.borrowDate < lastTransaction?.returnDate
  ) {
    return NextResponse.json(
      {
        message:
          "Borrow date must be greater then return date last approved or return transaction",
      },
      { status: 400 }
    );
  }

  const transaction = await prisma.borrow.update({
    where: {
      id: transactionId,
    },
    include: {
      item: true,
      user: true,
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
    // send notification whatsapp when approve
    const isMessage = generateTransactionMessage({
      adminName: transaction.approvedBy?.toString() || "",
      userName: transaction.user.username,
      collectionTitle: transaction.item.name,
      borrowDate: transaction.borrowDate.toString(),
      returnDate: transaction.returnDate.toString(),
      status: "approved",
    });

    // send notification to user
    transaction &&
      transaction.user.phone &&
      sendMessage(isMessage, transaction.user.phone.toString());

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
