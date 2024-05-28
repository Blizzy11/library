import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import axios from "axios";

const prisma = new PrismaClient();

export const POST = async (req: Request) => {
  const products = await prisma.user.findMany();
  console.log(products);
  return NextResponse.json(products);
};
