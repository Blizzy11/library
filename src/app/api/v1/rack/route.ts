import pagination from "@/helper/helper";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Get all categories
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
      { name: { contains: searchTerm } },
      { description: { contains: searchTerm } },
      {
        location: {
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

  const rack = await prisma.rack.findMany({
    skip: offset,
    take: pageSize,
    where: whereClause,
    include: {
      location: true,
    },
  });

  const totalRack = await prisma.rack.count({
    where: { is_active: true },
  });

  const totalPages = Math.ceil(totalRack / pageSize);

  return NextResponse.json({
    success: true,
    message: "Rack fetched successfully",
    data: rack,
    pagination: pagination(totalRack, totalPages),
  });
}

export async function POST(request: Request) {
  const { name, description, locationId } = await request.json();

  // check if rack name already exists in the same location
  const rackExists = await prisma.rack.findFirst({
    where: {
      name,
      locationId,
    },
  });
  if (rackExists) {
    return NextResponse.json(
      {
        success: false,
        message: "Rack name already exists in the same location",
      },
      {
        status: 400,
      }
    );
  }

  const rack = await prisma.rack.create({
    data: {
      name,
      description,
      locationId,
    },
  });
  if (rack) {
    return NextResponse.json(
      {
        success: true,
        message: "Rack added successfully",
        data: rack,
      },
      {
        status: 200,
      }
    );
  } else {
    return NextResponse.json(
      {
        success: false,
        message: "Rack not added",
      },
      {
        status: 400,
      }
    );
  }
}
