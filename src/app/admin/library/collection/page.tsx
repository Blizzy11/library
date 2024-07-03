"use server";

import CustomButton from "@/components/button/customButton";
import CustomSearch from "@/components/search/customSearch";
import Table from "@/components/table/table";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

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
        <Link href="/admin/library/collection/addCollection">
          <CustomButton type="button" classname="py-2 px-3">
            <div className="flex gap-2 items-center">
              Add Collection <AiOutlinePlus />
            </div>
          </CustomButton>
        </Link>
      </div>
      <Table dataHeader={dataHeader} url="/api/v1/collection" />
    </div>
  );
};

export default BookPage;
