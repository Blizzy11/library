import pagination from "@/helper/helper";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// add book
export async function POST(request: Request) {
  const {
    name,
    number,
    description,
    rack_name,
    locationId,
    categoryId,
    imageCover,
    createdBy,
  } = await request.json();

  // Prevent if collection name already exists in rack and location
  const collectionExists = await prisma.item.findFirst({
    where: {
      name,
      rack_name: rack_name,
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
      number,
      description,
      rack_name: rack_name,
      locationId: +locationId,
      categoryId: +categoryId,
      imageCover,
      createdBy,
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

// Update collection
export async function PUT(request: Request) {
  const {
    name,
    description,
    rack_name,
    locatioinId,
    categoryId,
    imageCover,
    updatedBy,
  } = await request.json();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const book = await prisma.item.update({
    where: {
      id: id as string,
    },
    data: {
      name,
      description,
      rack_name: rack_name,
      locationId: +locatioinId,
      categoryId: +categoryId,
      imageCover,
      updatedBy,
    },
  });

  if (book) {
    return NextResponse.json(
      {
        success: true,
        message: "Book updated successfully",
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
        message: "Book not updated",
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
  const status = searchParams.get("status") || "";

  // If have user id then filter by user
  const userId = searchParams.get("userId");

  const offset = (pageNumber - 1) * pageSize;

  // where condition
  let whereClause: Record<string, any> = {};

  if (searchTerm) {
    whereClause.OR = [
      { name: { contains: searchTerm } },
      { description: { contains: searchTerm } },
      {
        rack: {
          name: {
            contains: searchTerm,
          },
        },
      },
      {
        category: {
          name: {
            contains: searchTerm,
          },
        },
      },
    ];
  }

  if (id) {
    whereClause = {
      ...whereClause,
      id: id,
    };
  }

  if (userId) {
    whereClause = {
      ...whereClause,
      createdBy: userId,
    };
  }

  if (status && status !== "ALL") {
    whereClause = {
      ...whereClause,
      availability: status,
    };
  }

  const booksQuery = await prisma.item.findMany({
    skip: offset,
    take: pageSize,
    where: whereClause,
    include: {
      location: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalData = await prisma.item.count({ where: whereClause });
  const totalPage = Math.ceil(totalData / pageSize);
  const isPagination = pagination(totalData, totalPage);

  return NextResponse.json({
    message: "Books fetched successfully",
    data: booksQuery,
    pagination: isPagination,
  });
}
