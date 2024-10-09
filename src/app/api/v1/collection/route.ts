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
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const itemId = searchParams.get("itemId");
  const pageNumber = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("limit") || "10");
  const searchTerm = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  // if role user
  const creatorId = searchParams.get("creatorId");

  const offset = (pageNumber - 1) * pageSize;

  let whereClause: Record<string, any> = {};

  if (userId) {
    whereClause = {
      ...whereClause,
      userId,
    };
  }

  if (itemId) {
    whereClause = {
      ...whereClause,
      id: itemId,
    };
  }

  if (status && status !== "ALL") {
    whereClause = {
      ...whereClause,
      status,
    };
  }

  if (creatorId) {
    whereClause = {
      ...whereClause,
      createdBy: creatorId,
    };
  }

  if (searchTerm) {
    whereClause = {
      ...whereClause,
      OR: [
        { name: { contains: searchTerm } },
        { description: { contains: searchTerm } },
        {
          category: {
            name: {
              contains: searchTerm,
            },
          },
        },
      ],
    };
  }

  // Fetch paginated list of items (collections)
  const collections = await prisma.item.findMany({
    skip: offset,
    take: pageSize,
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      location: true,
      // Include user if needed
    },
  });

  // Pagination: total count and total pages
  const totalData = await prisma.item.count({ where: whereClause });
  const totalPage = Math.ceil(totalData / pageSize);
  const isPagination = pagination(totalData, totalPage);

  return NextResponse.json({
    message: "Items fetched successfully",
    data: collections,
    pagination: isPagination,
  });
}
