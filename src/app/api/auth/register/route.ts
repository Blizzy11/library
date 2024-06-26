import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { username, email, phone_number, password } = await request.json();

  // check if username or email already exists
  const userExists = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });
  if (userExists) {
    return NextResponse.json(
      {
        success: false,
        message: "Username or email already exists",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        phone: phone_number,
        password: bcrypt.hashSync(password, 10),
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: user,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "User creation failed",
        data: error,
      },
      {
        status: 400,
      }
    );
  }
}
