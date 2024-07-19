import { auth } from "@/auth";
import React from "react";

const UserHomePage = async () => {
  const session = await auth();
  return (
    <div>
      <h1>This Pages under development</h1>
    </div>
  );
};

export default UserHomePage;
