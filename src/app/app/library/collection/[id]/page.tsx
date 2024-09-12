"use server";

import CustomButton from "@/components/button/customButton";
import CollectionForm from "@/components/form/collection/addCollection";
import { CollectionData, GetCollectionByIdResponse } from "@/types/collection";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const prisma = new PrismaClient();

const UserEditCollectionPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const data = await getCollectionById(params.id);

  if (!data) {
    return (
      <div className={"flex flex-col justify-center items-center "}>
        <div className="border-b border-black p-5">
          <span className={"text-2xl font-bold"}>Collection Not Found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <span className="text-xl font-bold">Edit Collection</span>
      <CollectionForm data={data} />
    </div>
  );
};

async function getCollectionById(id: string) {
  try {
    const res = await prisma.item.findUnique({
      where: {
        id: id,
      },
      include: {
        location: true,
        category: true,
      },
    });

    return res as GetCollectionByIdResponse;
  } catch (error) {
    return null;
  }
}

export default UserEditCollectionPage;
