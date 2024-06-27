"use client";

import { useEffect, useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { GetTransactionDetailResponse } from "@/types/transaction";
import { toast } from "sonner";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { truncateDescription } from "@/helper/helper";
import Link from "next/link";

dayjs.extend(advancedFormat);

interface ModalDetailTransactionProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalDetailTransaction = ({
  isOpen,
  onClose,
}: ModalDetailTransactionProps) => {
  const [data, setData] = useState<GetTransactionDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();

  const handleCloseModal = () => {
    onClose();
    setData(null);
    setIsLoading(true);
    window.history.replaceState(null, "", window.location.pathname); // Mengembalikan URL ke keadaan semula
  };

  const getTransactionDetail = async (id: string) => {
    // setIsLoading(true);
    try {
      const res = await axios.get(
        `/api/v1/transaction/borrow/getTransactionDetail`,
        {
          params: {
            borrowId: id,
          },
        }
      );
      const { data } = res;
      setData(data.data);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      handleCloseModal();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const id = searchParams.get("transactionId");
    if (id) {
      getTransactionDetail(id);
    }
  }, [searchParams]);

  // useEffect(() => {
  //   const id = searchParams.get("transactionId");
  //   if (id) {
  //     setTransactionId(id);
  //   }
  // }, [searchParams]);

  // useEffect(() => {
  //   if (transactionId && isOpen) {
  //     getTransactionDetail(transactionId);
  //   }
  // }, [transactionId, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      modalTitle="Transaction Detail"
    >
      <div>
        {isLoading ? (
          <span className="loading loading-dots loading-md self-center"></span>
        ) : data ? (
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-3 text-md md:text-lg font-semibold">
              <p>Borrow Information</p>
            </div>
            <div className="text-sm md:text-md grid grid-cols-3 col-span-3">
              <p>Borrow Number</p>
              <div className="flex items-center col-span-2">
                <span className="pr-1">:</span>
                <span className="pl-1">{data.borrowNumber}</span>
              </div>

              <p>Borrow Date</p>
              <div className="flex items-start col-span-2">
                <span className="pr-1">:</span>
                <span className="pl-1">
                  {dayjs(data.borrowDate).format("dddd, DD MMM YYYY")}
                </span>
              </div>

              <p>Return Date</p>
              <div className="flex items-center col-span-2">
                <span className="pr-1">:</span>
                <span className="pl-1">
                  {dayjs(data.returnDate).format("dddd, DD MMM YYYY")}
                </span>
              </div>

              <p>Status</p>
              <div className="flex items-center col-span-2">
                <span className="pr-1">:</span>
                <span className="pl-1">{data.status}</span>
              </div>
            </div>

            <div className="col-span-3 text-md md:text-lg font-semibold">
              <p>Collection Information</p>
            </div>
            <div className="text-sm md:text-md grid grid-cols-3 col-span-3">
              <p>Collection Name</p>
              <div className="flex items-center col-span-2">
                <span className="pr-1">:</span>
                <span className="pl-1">{data.Item.name}</span>
              </div>

              <p>Collection Description</p>
              <div className="flex items-start col-span-2">
                <span className="pr-1">:</span>
                <span className="pl-1 text-justify">
                  {truncateDescription(data.Item.description, 50)}{" "}
                  <Link
                    href={`/app/collection/${data.Item.id}`}
                    className="text-blue-500 underline"
                  >
                    read more
                  </Link>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className={`flex justify-center items-center p-5`}>
            <p>Something went wrong, please try again</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalDetailTransaction;
