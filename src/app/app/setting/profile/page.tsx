"use server";

import { auth } from "@/auth";
import ProfileUpdate from "@/components/app/setting/profile/profileUpdate";
import { PrismaClient } from "@prisma/client";
import React from "react";

const prisma = new PrismaClient();

const ProfilePage = async () => {
  const isProfile = await getUserProfile();
  if (!isProfile) return <div>Not found</div>;

  return <ProfileUpdate data={isProfile} />;
};

async function getUserProfile() {
  const session = await auth();

  const data = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
  });

  return data;
}

export default ProfilePage;
