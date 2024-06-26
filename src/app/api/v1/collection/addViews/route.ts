import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { id } = await request.json();
  const views = await prisma.item.update({
    where: {
      id: id,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });
  return NextResponse.json({
    message: "Views added successfully",
    data: views,
  });
}
