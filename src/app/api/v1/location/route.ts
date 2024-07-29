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
    whereClause.OR = [{ name: { contains: searchTerm } }];
  }

  if (id) {
    whereClause = {
      ...whereClause,
      id: +id,
    };
  }

  const location = await prisma.location.findMany({
    skip: offset,
    take: pageSize,
    where: whereClause,
  });

  const totalLocation = await prisma.location.count({
    where: { is_active: true },
  });

  const totalPages = Math.ceil(totalLocation / pageSize);

  return NextResponse.json({
    success: true,
    message: "Location fetched successfully",
    data: location,
    pagination: pagination(totalLocation, totalPages),
  });
}

export async function POST(request: Request) {
  const { name } = await request.json();

  // check if location name already exists
  const locationExists = await prisma.location.findFirst({
    where: {
      name,
    },
  });
  if (locationExists) {
    return NextResponse.json(
      {
        success: false,
        message: "Location name already exists",
      },
      {
        status: 400,
      }
    );
  }

  const location = await prisma.location.create({
    data: {
      name,
    },
  });
  if (location) {
    return NextResponse.json(
      {
        success: true,
        message: "Rack added successfully",
        data: location,
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

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const location = await prisma.location.update({
    data: {
      is_active: false,
    },
    where: {
      id: id,
    },
  });
  if (location) {
    return NextResponse.json(
      {
        success: true,
        message: "Location deleted successfully",
        data: location,
      },
      {
        status: 200,
      }
    );
  } else {
    return NextResponse.json(
      {
        success: false,
        message: "Location not deleted",
      },
      {
        status: 400,
      }
    );
  }
}

export async function PUT(request: Request) {
  const { name } = await request.json();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const location = await prisma.location.update({
    data: {
      name,
    },
    where: {
      id: Number(id),
    },
  });
  if (location) {
    return NextResponse.json(
      {
        success: true,
        message: "Location updated successfully",
        data: location,
      },
      {
        status: 200,
      }
    );
  } else {
    return NextResponse.json(
      {
        success: false,
        message: "Location not updated",
      },
      {
        status: 400,
      }
    );
  }
}
