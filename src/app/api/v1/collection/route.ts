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
  const searchTerm = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  let whereClause: Record<string, any> = {};

  // Filter by userId if provided
  if (userId) {
    whereClause = {
      ...whereClause,
      userId,
    };
  }

  // Filter by itemId if provided
  if (itemId) {
    whereClause = {
      ...whereClause,
      id: itemId,
    };
  }

  // Filter by status if provided and it's not "ALL"
  if (status && status !== "ALL") {
    if (["AVAILABLE", "BORROWED", "MAINTENANCE", "LOST"].includes(status)) {
      whereClause = {
        ...whereClause,
        availability: status, // Assuming "availability" is the field for status
      };
    } else {
      return NextResponse.json({
        message: "Invalid status",
        data: [],
      });
    }
  }

  // Add search functionality
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

  try {
    // Fetch items based on the filters without pagination
    const collections = await prisma.item.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        location: true,
      },
    });

    if (collections.length === 0) {
      return NextResponse.json({
        message: "No data",
        data: [],
      });
    }

    return NextResponse.json({
      message: "Items fetched successfully",
      data: collections,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
