"use client";

import CustomButton from "@/components/button/customButton";
import ModalDetailTransaction from "@/components/modal/modalComponent/modalDetailTransaction";
import CustomSearch from "@/components/search/customSearch";
import { GetTransactionResponse } from "@/types/transaction";
import { GetAllUserResponse } from "@/types/user";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineContainer } from "react-icons/ai";
import { toast } from "sonner";
import { FaUserCheck, FaUserLargeSlash } from "react-icons/fa6";
import Modal from "@/components/modal/Modal";

const selectOptions = [
  {
    value: "ALL",
    label: "All",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "in-active",
    label: "In Active",
  },
];

export function UsersPageComponent() {
  const router = useRouter();
  const [data, setData] = useState<GetAllUserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [querySearch, setQuerySearch] = useState<string>("");

  const useParams = useSearchParams();
  const getStatusParams = useParams.get("status");

  const getTransaction = useCallback(
    async (reset: boolean = false) => {
      setIsLoading(true);
      try {
        const res = await axios.get("/api/v1/user", {
          params: {
            page: page,
            limit: 10,
            status: getStatusParams,
            search: querySearch,
          },
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
    },
    [page, getStatusParams, querySearch]
  );

  useEffect(() => {
    // Fetch data pertama kali atau ketika `getStatusParams` berubah, reset data
    getTransaction(true);
  }, [getStatusParams, querySearch, getTransaction]);

  useEffect(() => {
    // Fetch data saat halaman berubah
    if (page > 1) {
      getTransaction();
    }
  }, [page, getTransaction]);

  return (
    <div className={`flex flex-col gap-4 max-w-screen`}>
      <div>
        <CustomSearch
          placeholder="Search name, username, email, phone number"
          setState={setQuerySearch}
        />
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

              router.push(`/admin/user?status=${option.value}`, undefined);
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
                className="flex flex-col border border-black w-full p-3"
                key={data.id}
              >
                <div className="flex flex-row justify-between border-b border-black pb-2">
                  <div className="flex items-center gap-3">
                    {data.is_active == true ? (
                      <FaUserCheck />
                    ) : (
                      <FaUserLargeSlash className="text-red-500" />
                    )}
                    <span className="capitalize text-sm">{data.username}</span>
                  </div>
                  <span className="lowercase text-sm">{data.role}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex flex-row gap-1">
                    <span className="text-sm">Full Name: </span>
                    <span className="text-sm">
                      {data.name ? data.name : "Name Not Set"}
                    </span>
                  </div>
                  <div className="flex flex-row gap-1">
                    <span className="text-sm">Email: </span>
                    <span className="text-sm">{data.email}</span>
                  </div>
                  <div className="flex flex-row gap-1">
                    <span className="text-sm">Phone: </span>
                    <span className="text-sm">
                      {data.phone ? data.phone : "-"}
                    </span>
                  </div>
                  <div className="flex flex-row gap-1">
                    <span className="text-sm">Created At: </span>
                    <span className="text-sm">
                      {dayjs(data.createdAt).format("dddd, DD MMMM YYYY")}
                    </span>
                  </div>
                </div>
                <div className="pt-2 flex flex-row justify-end gap-3">
                  <CustomButton
                    type="button"
                    classname="px-3 py-1 text-sm"
                    onClick={() =>
                      toast.warning("This feature is not available yet")
                    }
                  >
                    Detail
                  </CustomButton>
                  <CustomButton
                    type="button"
                    classname="px-3 py-1 text-sm"
                    onClick={() => {
                      setOpenModal(true);
                      setUserId(data.id);
                    }}
                  >
                    {data.is_active ? "Deactivate" : "Activate"}
                  </CustomButton>
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

      <ActivateModal
        userId={userId}
        openModal={openModal}
        setOpenModal={setOpenModal}
        refacth={getTransaction}
      />
    </div>
  );
}

interface ActivateModalProps {
  userId: string;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  refacth: () => void;
}

function ActivateModal({
  userId,
  openModal,
  setOpenModal,
  refacth,
}: ActivateModalProps) {
  return (
    <Modal
      isOpen={openModal}
      onClose={() => setOpenModal(false)}
      modalTitle="Activate User"
      buttonCloseActive={false}
    >
      <div className="flex flex-col gap-3">
        <span>Are you sure you want to activate or deactivate this user?</span>
        <div className="flex justify-end gap-4">
          <CustomButton
            type="button"
            classname="btn py-1 btn-sm text-black hover:bg-fuchsia-500 hover:text-white"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </CustomButton>
          <CustomButton
            type="button"
            classname="btn py-1 btn-sm text-black hover:bg-fuchsia-500 hover:text-white"
            onClick={() => {
              toast.success("User activated");
              setOpenModal(false);
            }}
          >
            Save
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
}
