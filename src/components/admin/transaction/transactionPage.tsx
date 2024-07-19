"use client";

import CustomButton from "@/components/button/customButton";
import ModalDetailTransaction from "@/components/modal/modalComponent/modalDetailTransaction";
import CustomSearch from "@/components/search/customSearch";
import { GetTransactionResponse } from "@/types/transaction";
import axios from "axios";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineContainer } from "react-icons/ai";
import { toast } from "sonner";

const selectOptions = [
  {
    value: "ALL",
    label: "All",
  },
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "APPROVED",
    label: "Approved",
  },
  {
    value: "REJECTED",
    label: "Rejected",
  },
  {
    value: "RETURNED",
    label: "Returned",
  },
  {
    value: "CACNCELED",
    label: "Canceled",
  },
];

export function TransactionPage() {
  // Get session
  const { data: session } = useSession();

  const router = useRouter();
  const [data, setData] = useState<GetTransactionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [querySearch, setQuerySearch] = useState<string>("");

  const useParams = useSearchParams();
  const getStatusParams = useParams.get("status");

  const getTransaction = async (reset: boolean = false) => {
    setIsLoading(true);
    try {
      // set params
      const params: any = {
        page: page,
        limit: 10,
        status: getStatusParams,
        search: querySearch,
      };

      if (session && session.user.role === "USER") {
        params.bookOwnerId = session.user.id;
      }

      const res = await axios.get("/api/v1/transaction/borrow", {
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
    <div className={`flex flex-col gap-4 max-w-screen-sm`}>
      <div>
        <p>
          <span className="text-xl font-bold">Transaction</span>
        </p>
      </div>
      <div>
        <CustomSearch placeholder="Search..." setState={setQuerySearch} />
      </div>
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

              console.log(window.location.pathname);

              window.history.replaceState(
                null,
                "",
                `${window.location.pathname}?status=${option.value}`
              );

              // router.push(
              //   `/admin/transaction?status=${option.value}`,
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
          <div className="flex flex-col gap-3">
            {data.data.map((data) => (
              <div
                className="flex flex-col border border-black w-full"
                key={data.id}
              >
                <div className="flex flex-col justify-between p-3">
                  <div className="flex flex-row justify-between gap-4 items-center border-b border-black pb-2">
                    <div className="flex flex-row gap-2 items-center">
                      <AiOutlineContainer size={20} />
                      <div className="text-xs md:text-md lg:text-md">
                        {data.borrowNumber}
                      </div>
                    </div>
                    <div
                      className={`border border-black rounded-md p-1 w-fit text-center text-xs md:text-sm lg:text-md`}
                    >
                      {data.status}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="">{data.user.username}</div>
                    <div className="text-lg font-bold">{data.item.name}</div>
                    <div className="text-xs">
                      {dayjs(data.borrowDate).format("dddd, DD MMMM YYYY") +
                        " - " +
                        dayjs(data.returnDate).format("dddd, DD MMMM YYYY")}
                    </div>
                    <div className="flex flex-row gap-2 text-xs self-end">
                      <button
                        className={`bg-black text-white rounded-md p-1 w-fit`}
                        onClick={() => {
                          setOpenModal(true);

                          const searchParams = new URLSearchParams(
                            window.location.search
                          );
                          searchParams.set("transactionId", data.id);

                          window.history.replaceState(
                            null,
                            "",
                            `${
                              window.location.pathname
                            }?${searchParams.toString()}`
                          );

                          // router.push(
                          //   `/admin/transaction?${searchParams.toString()}`
                          // );
                        }}
                      >
                        See Detail
                      </button>
                    </div>
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

      <ModalDetailTransaction
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        reFetchData={getTransaction}
      />
    </div>
  );
}
