import Table from "@/components/table/table";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { get } from "http";
import { useEffect, useState } from "react";

const prisma = new PrismaClient();

const getUsers = async () => {
  const res = await prisma.user.findMany();
  return res;
};

const Home = async () => {
  const getUser = await getUsers();
  return <div></div>;
};

export default Home;
