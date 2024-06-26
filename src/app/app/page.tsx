import { auth } from "@/auth";
import React from "react";

const UserHomePage = async () => {
  const session = await auth();
  return <div>{JSON.stringify({ session })}</div>;
};

export default UserHomePage;
