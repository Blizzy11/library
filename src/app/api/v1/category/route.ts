import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Get all categories
export async function GET() {
  const categories = await prisma.category.findMany({
    where: {
      is_active: true,
    },
  });
  return NextResponse.json(categories);
}
