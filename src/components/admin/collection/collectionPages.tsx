"use client";

import CustomButton from "@/components/button/customButton";
import ModalDetailTransaction from "@/components/modal/modalComponent/modalDetailTransaction";
import CustomSearch from "@/components/search/customSearch";
import { GetCollectionResponse } from "@/types/collection";
import { GetTransactionResponse } from "@/types/transaction";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IoBookSharp, IoLocation } from "react-icons/io5";
import { truncateDescription } from "@/helper/helper";
import { AiOutlinePartition } from "react-icons/ai";
import ModalDetailCollection from "@/components/modal/modalComponent/modalDetailCollection";
import { BsHddRackFill } from "react-icons/bs";
import { useSession } from "next-auth/react";

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

type ParamsGetCollection = {
  page: number;
  limit: number;
  status?: string;
  search?: string;
  userId?: string;
};

export function CollectionPagesComponent() {
  // Get session
  const { data: session } = useSession();

  const router = useRouter();
  const [data, setData] = useState<GetCollectionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [querySearch, setQuerySearch] = useState<string>("");

  const useParams = useSearchParams();
  const getStatusParams = useParams.get("status") ?? "";

  const getTransaction = async (reset: boolean = false) => {
    setIsLoading(true);
    try {
      const params: ParamsGetCollection = {
        page: page,
        limit: 10,
        status: getStatusParams,
        search: querySearch,
      };

      if (session?.user?.role === "USER") {
        params.userId = session?.user?.id;
      }

      const res = await axios.get("/api/v1/collection", {
        params,
      });

      setData((prevData) => ({
        ...res.data,
        data: reset
          ? res.data.data
          : [...(prevData?.data || []), ...res.data.data],
      }));
    } catch (error) {
      toast.error(
        (error as any).response?.data?.message || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data pertama kali atau ketika `getStatusParams` berubah, reset data
    getTransaction(true);
  }, [getStatusParams, querySearch]);

  useEffect(() => {
    // Fetch data saat halaman berubah
    if (page > 1) {
      getTransaction();
    }
  }, [page]);

  return (
    <div className={`flex flex-col gap-4 max-w-screen`}>
      <div>
        <CustomSearch placeholder="Search..." setState={setQuerySearch} />
      </div>
      <Link
        href={
          session?.user.role == "ADMIN"
            ? `/admin/library/collection/addCollection`
            : `/app/library/collection/addCollection`
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
                window.history.replaceState(null, "", window.location.pathname); // Mengembalikan URL ke keadaan semula
                return;
              }

              if (session?.user?.role === "ADMIN") {
                router.push(
                  `/admin/library/collection?status=${option.value}`,
                  undefined
                );
                return;
              } else {
                router.push(
                  `/app/library/collection?status=${option.value}`,
                  undefined
                );
                return;
              }

              // router.push(
              //   `/admin/library/collection?status=${option.value}`,
              //   undefined
              // );
            }}
          >
            {option.label}
          </div>
        ))}
      </div>
      <div className="">
        {isLoading && page === 1 ? (
          <div className="flex justify-center">
            <span className="loading loading-dots loading-sm"></span>
          </div>
        ) : data && data?.data.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {data.data.map((data) => (
              <div
                className="flex flex-col border p-3 border-black gap-4"
                key={data.id}
              >
                <div className="flex flex-row justify-between border-b border-black pb-2">
                  <div className="flex gap-3 items-center">
                    <IoBookSharp />
                    <span className="capitalize text-sm">{data.name}</span>
                  </div>
                  <div>
                    <span className="capitalize text-xs border border-black p-1">
                      {data.availability}
                    </span>
                  </div>
                </div>
                <div className="">
                  <div className="flex flex-col">
                    <p className="text-xs flex gap-2 items-center">
                      <IoLocation />
                      {data.rack.location.name}
                    </p>
                    <p className="text-xs flex gap-2 items-center">
                      <BsHddRackFill />
                      {data.rack.name}
                    </p>
                  </div>
                  {data.description ? (
                    <p className="text-xs text-justify py-3">
                      {truncateDescription(data.description, 25)}
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
                        searchParams.set("id", data.id);

                        // Berdasarkan Role
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
                        router.push(`${window.location.pathname}/${data.id}`);

                        // window.history.pushState(
                        //   null,
                        //   "",
                        //   window.location.pathname + `/${data.id}`
                        // );
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
      {isLoading && page > 1 && (
        <div className="flex justify-center">
          <span className="loading loading-dots loading-sm"></span>
        </div>
      )}
      {page < (data?.pagination.totalPage ?? 0) && (
        <div className="self-center">
          <CustomButton
            type="button"
            classname="px-3 py-1"
            onClick={() => setPage(page + 1)}
          >
            Load More
          </CustomButton>
        </div>
      )}

      <ModalDetailCollection
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      />
    </div>
  );
}
