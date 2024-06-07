"use server";

import CustomButton from "@/components/button/customButton";
import CustomSearch from "@/components/search/customSearch";
import Table from "@/components/table/table";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import React from "react";

const prisma = new PrismaClient();

async function getData(page: number = 1, limit: number = 10) {
  const data = await prisma.item.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      is_active: true,
    },
    include: {
      rack: true,
      category: true,
    },
  });
  return data;
}

const dataHeader = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "rack.name",
    label: "Rack",
  },
  {
    key: "category.name",
    label: "Category",
  },
  {
    key: "availability",
    label: "Avaibility",
  },
];

const BookPage = async () => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/admin/library/book/addCollection">
          <CustomButton type="button" text="Add Collection" />
        </Link>
      </div>
      <Table dataHeader={dataHeader} url="/api/v1/collection" />
    </div>
  );
};

export default BookPage;
