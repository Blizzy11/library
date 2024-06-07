import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dataRack = [
  {
    name: "Rack 1",
    description: "Rak 1",
    location: "Rak 1",
  },
  {
    name: "Rack 2",
    description: "Rak 2",
    location: "Rak 2",
  },
  {
    name: "Rack 3",
    description: "Rak 3",
    location: "Rak 3",
  },
];

const dataCategory = [
  {
    name: "Category 1",
  },
  {
    name: "Category 2",
  },
  {
    name: "Category 3",
  },
];

async function main() {
  const user = await prisma.user.create({
    data: {
      nik: "1234567890",
      name: "Admin",
      email: "haris@mail.com",
    },
  });

  dataRack.map(async (data) => {
    await prisma.rack.create({
      data: {
        ...data,
      },
    });
  });

  dataCategory.map(async (data) => {
    await prisma.category.create({
      data: {
        ...data,
      },
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
