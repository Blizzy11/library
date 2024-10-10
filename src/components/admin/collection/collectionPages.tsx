"use client";

import CustomButton from "@/components/button/customButton";
import ModalDetailTransaction from "@/components/modal/modalComponent/modalDetailTransaction";
import CustomSearch from "@/components/search/customSearch";
import { GetCollectionResponse } from "@/types/collection";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { IoBookSharp, IoLocation } from "react-icons/io5";
import { truncateDescription } from "@/helper/helper";
import { BsHddRackFill } from "react-icons/bs";
import { useSession } from "next-auth/react";
import ModalDetailCollection from "@/components/modal/modalComponent/modalDetailCollection";

const selectOptions = [
  {
    value: "ALL",
    label: "All",
  },
  {
    value: "AVAILABLE",
    label: "Available",
  },
  {
    value: "BORROWED",
    label: "Borrowed",
  },
  {
    value: "MAINTENANCE",
    label: "Maintenance",
  },
  {
    value: "LOST",
    label: "Lost",
  },
];

export function CollectionPagesComponent() {
  // Get session
  const { data: session } = useSession();

  const router = useRouter();
  const [data, setData] = useState<GetCollectionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [querySearch, setQuerySearch] = useState<string>("");

  const useParams = useSearchParams();
  const getStatusParams = useParams.get("status") ?? "";

  const getTransaction = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | undefined> = {
        status: getStatusParams,
        search: querySearch ? querySearch : undefined,
      };

      if (session?.user?.role === "USER") {
        params.userId = session?.user?.id;
      }

      const res = await axios.get("/api/v1/collection", { params });
      setData(res.data);
    } catch (error) {
      toast.error(
        (error as any).response?.data?.message || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  }, [getStatusParams, querySearch, session?.user?.role, session?.user?.id]);

  useEffect(() => {
    getTransaction();
  }, [querySearch, getTransaction]);

  return (
    <div className="flex flex-col gap-4 max-w-screen">
      <div>
        <CustomSearch placeholder="Search..." setState={setQuerySearch} />
      </div>
      <Link
        href={
          session?.user.role == "ADMIN"
            ? "/admin/library/collection/addCollection"
            : "/app/library/collection/addCollection"
        }
      >
        <div className="border border-black bg-transparent p-3 cursor-pointer hover:bg-black hover:text-white transition-all duration-700">
          Add Collection
        </div>
      </Link>
      <div className="flex flex-row gap-3 items-center overflow-x-auto hide-scrollbar">
        {selectOptions.map((option) => (
          <div
            key={option.value}
            className={`border border-black p-1 w-32 min-w-32 text-center cursor-pointer ${
              (!getStatusParams && option.value === "ALL") ||
              getStatusParams === option.value
                ? "bg-black text-white"
                : ""
            }`}
            onClick={() => {
              if (option.value === "ALL") {
                window.history.replaceState(null, "", window.location.pathname);
                return;
              }

              if (session?.user?.role === "ADMIN") {
                router.push(`/admin/library/collection?status=${option.value}`);
              } else {
                router.push(`/app/library/collection?status=${option.value}`);
              }
            }}
          >
            {option.label}
          </div>
        ))}
      </div>
      <div className="">
        {isLoading ? (
          <div className="flex justify-center">
            <span className="loading loading-dots loading-sm"></span>
          </div>
        ) : data && data?.data.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {data.data.map((item) => (
              <div
                className="flex flex-col border p-3 border-black gap-4"
                key={item.id}
              >
                <div className="flex flex-row justify-between border-b border-black pb-2">
                  <div className="flex gap-3 items-center">
                    <IoBookSharp />
                    <span className="capitalize text-sm">{item.name}</span>
                  </div>
                  <div>
                    <span className="capitalize text-xs border border-black p-1">
                      {item.availability}
                    </span>
                  </div>
                </div>
                <div className="">
                  <div className="flex flex-col">
                    <p className="text-xs flex gap-2 items-center">
                      <IoLocation />
                      {item.rack_name}
                    </p>
                    <p className="text-xs flex gap-2 items-center">
                      <BsHddRackFill />
                      {item.location.name}
                    </p>
                  </div>
                  {item.description ? (
                    <p className="text-xs text-justify py-3">
                      {truncateDescription(item.description, 25)}
                    </p>
                  ) : (
                    <p className="text-xs">No description</p>
                  )}
                  <div className="flex flex-row flex-wrap justify-end gap-3">
                    <CustomButton
                      type="button"
                      boxShadow="3px 3px"
                      classname="px-2 py-1 text-sm"
                      onClick={() => {
                        setOpenModal(true);
                        const searchParams = new URLSearchParams(
                          window.location.search
                        );
                        searchParams.set("id", item.id);
                        if (session?.user?.role === "ADMIN") {
                          router.push(
                            `/admin/library/collection?${searchParams.toString()}`
                          );
                        } else {
                          router.push(
                            `/app/library/collection?${searchParams.toString()}`
                          );
                        }
                      }}
                    >
                      Detail
                    </CustomButton>
                    <CustomButton
                      type="button"
                      boxShadow="3px 3px"
                      classname="px-2 text-sm"
                      onClick={() => {
                        router.push(`${window.location.pathname}/${item.id}`);
                      }}
                    >
                      Edit
                    </CustomButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">No data</div>
        )}
      </div>
      <ModalDetailCollection
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      />
    </div>
  );
}
