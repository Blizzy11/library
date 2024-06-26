import { auth } from "@/auth";
import React from "react";
import { json } from "stream/consumers";

const AdminHomePage = async () => {
  const session = await auth();
  return (
    <>
      <h2 className="text-2xl font-bold mb-5">Main Content</h2>
      <p>This is the main content area. You can add more content here.</p>
      {JSON.stringify(session)}
    </>
  );
};

export default AdminHomePage;
