import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user;
};
