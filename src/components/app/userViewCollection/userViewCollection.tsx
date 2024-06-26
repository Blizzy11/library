"use client";

import CustomButton from "@/components/button/customButton";
import Modal from "@/components/modal/Modal";
import ModalFormBorrow from "@/components/modal/modalComponent/modalFormBorrow";
import { thousandSeparator } from "@/helper/helper";
import { CollectionData } from "@/types/collection";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiOutlineHeart, AiOutlineSelect } from "react-icons/ai";
import { toast } from "sonner";

interface UserViewCollectionProps {
  id: string;
}

const UserViewCollection = ({ id }: UserViewCollectionProps) => {
  const [data, setData] = useState<CollectionData>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const getCollection = async () => {
    try {
      await axios
        .get("/api/v1/collection", {
          params: {
            id: id,
          },
        })
        .then((res) => {
          setData(res.data.data);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } catch (error) {
      toast.error("Something went wrong");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getCollection();
  }, [id]);

  return (
    <div className={`border border-black`}>
      <div className="flex flex-col">
        {isLoading ? (
          <div className="flex justify-center items-center p-3">
            <span className="loading loading-dots loading-sm"></span>
          </div>
        ) : (
          <div className={`flex flex-col`}>
            <div className="flex flex-col">
              <div className={`border-b border-black p-3`}>
                {data[0] && data[0].imageCover ? (
                  <Image
                    src={data[0].imageCover}
                    alt={data[0].name}
                    className="m-auto h-24 w-24"
                  />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`m-auto h-24 w-24`}
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M14.2647 15.9377L12.5473 14.2346C11.758 13.4519 11.3633 13.0605 10.9089 12.9137C10.5092 12.7845 10.079 12.7845 9.67922 12.9137C9.22485 13.0605 8.83017 13.4519 8.04082 14.2346L4.04193 18.2622M14.2647 15.9377L14.606 15.5991C15.412 14.7999 15.8149 14.4003 16.2773 14.2545C16.6839 14.1262 17.1208 14.1312 17.5244 14.2688C17.9832 14.4253 18.3769 14.834 19.1642 15.6515L20 16.5001M14.2647 15.9377L18.22 19.9628M12 4H7.2C6.07989 4 5.51984 4 5.09202 4.21799C4.7157 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.0799 4 7.2V16.8C4 17.4466 4 17.9066 4.04193 18.2622M4.04193 18.2622C4.07264 18.5226 4.12583 18.7271 4.21799 18.908C4.40973 19.2843 4.7157 19.5903 5.09202 19.782C5.51984 20 6.07989 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V12M16 3L18.5 5.5M18.5 5.5L21 8M18.5 5.5L21 3M18.5 5.5L16 8"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                )}
              </div>

              <p className="text-xl font-bold px-3 py-2 border-b border-black">
                {data[0] && data[0].name}
              </p>

              <div
                className={`border-b border-black flex flex-row justify-around p-3 text-sm items-center`}
              >
                <div className={`border border-black px-2 py-1`}>
                  {data[0] && data[0].availability}
                </div>
                <div>{thousandSeparator(data[0] && data[0].views)} dilihat</div>
              </div>

              <div className={`p-3 text-sm border-b border-black`}>
                <p className={`text-justify`}>
                  {data[0] && data[0].description}
                </p>
              </div>

              <div
                className={`p-3 self-center flex-row flex items-center gap-3`}
              >
                <CustomButton
                  type="button"
                  classname="p-2"
                  onClick={() => {
                    toast.warning("Feature coming soon");
                  }}
                >
                  <div className="flex flex-row items-center gap-2">
                    <AiOutlineHeart />
                    <p className="text-sm font-normal">Add to Collection</p>
                  </div>
                </CustomButton>

                <CustomButton
                  type="button"
                  classname="p-2"
                  onClick={() => setIsOpen(true)}
                >
                  <div className="flex flex-row items-center gap-2">
                    <AiOutlineSelect />
                    <p className="text-sm font-normal">Borrow</p>
                  </div>
                </CustomButton>

                <ModalFormBorrow
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  collectionId={data[0] && data[0].id}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserViewCollection;
