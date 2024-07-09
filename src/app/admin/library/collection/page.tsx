"use server";

import { CollectionPagesComponent } from "@/components/admin/collection/collectionPages";
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
    <div className="flex flex-col gap-4">
      <span className="text-xl font-bold">Library</span>
      <CollectionPagesComponent />
    </div>
  );
};

export default BookPage;
