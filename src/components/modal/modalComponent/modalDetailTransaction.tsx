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
import { useSession } from "next-auth/react";
import CustomButton from "@/components/button/customButton";

dayjs.extend(advancedFormat);

interface ModalDetailTransactionProps {
  isOpen: boolean;
  onClose: () => void;
  reFetchData?: (reset: boolean) => void;
}

const ModalDetailTransaction = ({
  isOpen,
  onClose,
  reFetchData,
}: ModalDetailTransactionProps) => {
  const [data, setData] = useState<GetTransactionDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const { data: session } = useSession();

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
      toast.error("Something went wrong");
      handleCloseModal();
    }
    setIsLoading(false);
  };

  const approveTransaction = async (transactionId: string) => {
    if (!session) {
      toast.error("You have not access to approve this transaction");
      return;
    }

    const data = {
      transactionId: transactionId,
      approvedAt: dayjs().toISOString(),
      approvedBy: session.user.name,
    };
    try {
      await axios
        .post("/api/v1/transaction/borrow/approve", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (reFetchData) {
            reFetchData(true);
          }
          handleCloseModal();
          toast.success(res.data.message);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const declineTransaction = async (transactionId: string) => {
    if (!session) {
      toast.error("You have not access to decline this transaction");
      return;
    }

    const data = {
      transactionId: transactionId,
    };
    try {
      await axios
        .post("/api/v1/transaction/borrow/decline", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (reFetchData) {
            reFetchData(true);
          }
          handleCloseModal();
          toast.success(res.data.message);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    } catch (error) {
      toast.error("Something went wrong");
    }
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
      buttonCloseActive={false}
      // buttonCloseActive={session.data?.user.role === "ADMIN" ? false : true}
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
                <span className="pl-1">{data.item.name}</span>
              </div>

              <p>Collection Description</p>
              <div className="flex items-start col-span-2">
                <span className="pr-1">:</span>
                <span className="pl-1 text-justify">
                  {truncateDescription(data.item.description, 50)}{" "}
                  <Link
                    href={`/app/collection/${data.item.id}`}
                    className="text-blue-500 underline"
                  >
                    read more
                  </Link>
                </span>
              </div>

              <p>Collection Status</p>
              <div className="flex items-center col-span-2">
                <span className="pr-1">:</span>
                <span className="pl-1">{data.item.availability}</span>
              </div>
            </div>

            {/* {session.data?.user.role === "ADMIN" && ( */}
            <div className="col-span-3 flex justify-end gap-4 pt-3">
              {data.status === "PENDING" && (
                <>
                  <div>
                    <CustomButton
                      onClick={() => {
                        approveTransaction(data.id);
                      }}
                      type="button"
                      classname="py-1 px-3"
                    >
                      Approve
                    </CustomButton>
                  </div>

                  <div>
                    <CustomButton
                      onClick={() => {
                        declineTransaction(data.id);
                      }}
                      type="button"
                      classname="py-1 px-3"
                    >
                      Reject
                    </CustomButton>
                  </div>
                </>
              )}

              <div>
                <CustomButton
                  onClick={handleCloseModal}
                  type="button"
                  classname="py-1 px-3"
                >
                  Close
                </CustomButton>
              </div>
            </div>
            {/* )} */}
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
