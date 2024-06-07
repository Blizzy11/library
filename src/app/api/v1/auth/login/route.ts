import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import axios from "axios";

const prisma = new PrismaClient();

export const POST = async (req: Request, res: Response) => {
  const { nik, password } = await req.json();

  return NextResponse.json({
    data: {
      name: "Muhammad Haris K",
      email: "muhammadhariskumala@ui.ac.id",
    },
  });
};
