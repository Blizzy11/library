import { UsersPageComponent } from "@/components/admin/user/userPage";
import React from "react";

const UserPage = () => {
  return (
    <div className={"flex flex-col gap-4"}>
      <span className="text-xl font-bold">User</span>
      <UsersPageComponent />
    </div>
  );
};

export default UserPage;
