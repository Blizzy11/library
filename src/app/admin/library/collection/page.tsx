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

const BookPage = async () => {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-xl font-bold">Collection</span>
      <CollectionPagesComponent />
    </div>
  );
};

export default BookPage;
