import pagination from "@/helper/helper";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// add book
export async function POST(request: Request) {
  const { name, description, rackId, categoryId, imageCover } =
    await request.json();

  const book = await prisma.item.create({
    data: {
      name,
      description,
      rackId,
      categoryId,
      imageCover,
    },
  });

  if (book) {
    return NextResponse.json(
      {
        success: true,
        message: "Book added successfully",
        data: book,
      },
      {
        status: 200,
      }
    );
  } else {
    return NextResponse.json(
      {
        success: false,
        message: "Book not added",
      },
      {
        status: 400,
      }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageNumber = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("limit") || "10");
  const searchTerm = searchParams.get("search") || "";

  const offset = (pageNumber - 1) * pageSize;

  const booksQuery = prisma.item.findMany({
    skip: offset,
    take: pageSize,
    where: {
      is_active: true,
      OR: [
        { name: { contains: searchTerm } },
        { description: { contains: searchTerm } },
        { rack: { name: { contains: searchTerm } } },
        { category: { name: { contains: searchTerm } } },
      ],
    },
    include: {
      rack: true,
      category: true,
    },
  });

  const totalBooks = await prisma.item.count({
    where: { is_active: true },
  });

  const totalPages = Math.ceil(totalBooks / pageSize);

  const books = await booksQuery;

  return NextResponse.json({
    success: true,
    message: "Books fetched successfully",
    data: books,
    pagination: pagination(totalBooks, totalPages),
  });
}
