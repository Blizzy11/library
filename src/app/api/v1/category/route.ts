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
    let isActiveSearchTerm: boolean | null = null;

    if (searchTerm.toLowerCase() === "active") {
      isActiveSearchTerm = true;
    } else if (searchTerm.toLowerCase() === "inactive") {
      isActiveSearchTerm = false;
    }

    whereClause.OR = [{ name: { contains: searchTerm } }];

    if (isActiveSearchTerm !== null) {
      whereClause.OR.push({ is_active: isActiveSearchTerm });
    }
  }

  if (id) {
    whereClause = {
      ...whereClause,
      id: +id,
    };
  }

  const category = await prisma.category.findMany({
    skip: offset,
    take: pageSize,
    where: whereClause,
  });

  const totalCategory = await prisma.category.count({
    where: { is_active: true },
  });

  const totalPages = Math.ceil(totalCategory / pageSize);

  return NextResponse.json({
    success: true,
    message: "Rack fetched successfully",
    data: category,
    pagination: pagination(totalCategory, totalPages),
  });
}

export async function POST(request: Request) {
  const { name } = await request.json();

  // check if rack name already exists in the same location
  const categoryExists = await prisma.category.findFirst({
    where: {
      name,
    },
  });
  if (categoryExists) {
    return NextResponse.json(
      {
        success: false,
        message: "Cateegory already exists",
      },
      {
        status: 400,
      }
    );
  }

  const category = await prisma.category.create({
    data: {
      name,
    },
  });
  if (category) {
    return NextResponse.json(
      {
        success: true,
        message: "Rack added successfully",
        data: category,
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

export async function PUT(request: Request) {
  const { name, id } = await request.json();
  const { searchParams } = new URL(request.url);

  // check if id exists
  if (!id) {
    return NextResponse.json(
      {
        success: false,
        message: "Id not found",
      },
      {
        status: 400,
      }
    );
  }

  const category = await prisma.category.update({
    where: {
      id: +id,
    },
    data: {
      name,
    },
  });

  if (category) {
    return NextResponse.json(
      {
        success: true,
        message: "Category updated successfully",
        data: category,
      },
      {
        status: 200,
      }
    );
  } else {
    return NextResponse.json(
      {
        success: false,
        message: "Category not updated",
      },
      {
        status: 400,
      }
    );
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const category = await prisma.category.update({
    data: {
      is_active: false,
    },
    where: {
      id: id,
    },
  });
  if (category) {
    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully",
        data: category,
      },
      {
        status: 200,
      }
    );
  } else {
    return NextResponse.json(
      {
        success: false,
        message: "Category not deleted",
      },
      {
        status: 400,
      }
    );
  }
}
