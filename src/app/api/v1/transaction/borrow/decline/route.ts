import { generateTransactionMessage, sendMessage } from "@/helper/helper";
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
    include: {
      user: true,
      item: true,
    },
    data: {
      status: "REJECTED",
    },
  });

  // send notification whatsapp
  const isMessage = generateTransactionMessage({
    adminName: declineTransaction.approvedBy?.toString() || "",
    userName: declineTransaction.user.username,
    collectionTitle: declineTransaction.item.name,
    borrowDate: declineTransaction.borrowDate.toString(),
    returnDate: declineTransaction.returnDate.toString(),
    status: "rejected",
  });

  // send notification to user
  declineTransaction &&
    declineTransaction.user.phone &&
    sendMessage(isMessage, declineTransaction.user.phone.toString());

  return NextResponse.json({
    message: "Transaction declined",
    data: declineTransaction,
  });
}
