import pagination from "@/helper/helper";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// add book
export async function POST(request: Request) {
  const { name, description, rackId, categoryId, imageCover } =
    await request.json();

  // Prevent if collection name already exists in rack and location
  const collectionExists = await prisma.item.findFirst({
    where: {
      name,
      rackId: +rackId,
    },
  });
  if (collectionExists) {
    return NextResponse.json(
      {
        success: false,
        message: "Collection name already exists in the same rack",
      },
      {
        status: 400,
      }
    );
  }

  const book = await prisma.item.create({
    data: {
      name,
      description,
      rackId: +rackId,
      categoryId: +categoryId,
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
  const id = searchParams.get("id");

  const offset = (pageNumber - 1) * pageSize;

  // where condition
  let whereClause: Record<string, any> = { is_active: true }; // Base where clause

  if (searchTerm) {
    whereClause.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
      { "rack.name": { contains: searchTerm, mode: "insensitive" } },
      { "category.name": { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  if (id) {
    whereClause = {
      ...whereClause,
      id: id,
    };
  }

  const booksQuery = prisma.item.findMany({
    skip: offset,
    take: pageSize,
    where: whereClause,
    include: {
      rack: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
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
