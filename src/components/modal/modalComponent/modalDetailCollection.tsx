"use client";

import { useSearchParams } from "next/navigation";
import Modal from "../Modal";
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { GetCollectionResponse } from "@/types/collection";
import { MdOutlineNumbers } from "react-icons/md";
import { IoBookSharp, IoLocation } from "react-icons/io5";
import { BsHddRackFill } from "react-icons/bs";
import { LuAlarmClock } from "react-icons/lu";
import QRCode from "react-qr-code";
import dayjs from "dayjs";

interface ModalDetailCollectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalDetailCollection({
  isOpen,
  onClose,
}: ModalDetailCollectionProps) {
  const params = useSearchParams();

  const [data, setData] = useState<GetCollectionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCollectionById = async (collectionId: string) => {
    setIsLoading(true);
    try {
      await axios
        .get(`/api/v1/collection`, {
          params: {
            id: collectionId,
          },
        })
        .then((res) => {
          setData(res.data);
        })
        .catch((error) => {
          handleClose();
          toast.error(error.response.data.message || "Something went wrong");
        });
    } catch (error) {
      toast.error("Something went wrong");
      handleClose();
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    onClose();
    window.history.replaceState(null, "", window.location.pathname);
    setData(null);
    setIsLoading(true);
  };

  useEffect(() => {
    const collectionId = params.get("id");
    if (collectionId) {
      getCollectionById(collectionId);
    }
  }, [params]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} modalTitle="Collection Detail">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-dots loading-sm"></span>
        </div>
      ) : (
        <div className="max-h-[50vh] overflow-y-auto flex flex-col">
          <div className="flex justify-center mb-5">
            <QRCode
              size={256}
              //   style={{ height: "auto", maxWidth: "50%", width: "50%" }}
              value={data?.data[0].number || "notfound"}
              viewBox={`0 0 256 256`}
              className="flex justify-center items-center w-1/4 h-1/4"
            />
          </div>
          <div className="flex flex-row-reverse gap-3 items-center">
            <IoBookSharp />
            <p className="text-md font-semibold">{data?.data[0].name}</p>
          </div>
          <div className="flex flex-row-reverse gap-3 items-center">
            <MdOutlineNumbers />
            <p className="text-sm">{data?.data[0].number}</p>
          </div>
          <div className="flex flex-row-reverse gap-3 items-center">
            <IoLocation />
            <p className="text-sm">{data?.data[0].rack.location.name}</p>
          </div>
          <div className="flex flex-row-reverse gap-3 items-center">
            <BsHddRackFill />
            <p className="text-sm ">{data?.data[0].rack.name}</p>
          </div>
          <div className="flex flex-row-reverse gap-3 items-center">
            <LuAlarmClock />
            <p className="text-sm ">
              {data?.data[0].createdAt
                ? dayjs(data?.data[0].createdAt).format("dddd, DD MMMM YYYY")
                : "-"}
            </p>
          </div>
          <div className="flex flex-row-reverse items-center">
            <span className="text-xs border border-black p-1 mt-2">
              {data?.data[0].availability}
            </span>
          </div>
          <div className="border-b border-black pt-2 pb-2">
            <p className="text-sm font-semibold">Description</p>
          </div>
          <div>
            <p className="text-sm text-justify">{data?.data[0].description}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
