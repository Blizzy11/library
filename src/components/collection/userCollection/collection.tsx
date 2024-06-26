"use client";

import CustomButton from "@/components/button/customButton";
import { thousandSeparator } from "@/helper/helper";
import { CollectionData } from "@/types/collection";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Collection = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [collection, setCollection] = useState<CollectionData>([]);

  // get collection
  const getCollection = async () => {
    try {
      await axios
        .get("/api/v1/collection")
        .then((res) => {
          console.log(res.data);
          setCollection(res.data.data);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } catch (error) {
      toast.error("Something went wrong");
    }
    setIsLoading(false);
  };

  // add views collection
  const addViewCollection = async (id: string) => {
    await axios.post("/api/v1/collection/addViews", {
      id: id,
    });
  };

  useEffect(() => {
    getCollection();
  }, []);

  return (
    <div className={`flex flex-wrap gap-3`}>
      {isLoading ? (
        <span className="loading loading-dots loading-sm"></span>
      ) : collection.length > 0 ? (
        collection.map((item) => (
          <div
            key={item.id}
            className="w-[10rem] md:w-[15rem] max-w-[15rem] border flex flex-col justify-center border-black overflow-hidden relative"
          >
            <div>
              {item.imageCover ? (
                <Image
                  src={item.imageCover}
                  alt={item.name}
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
                // <Image
                //   src="../vercel.svg"
                //   alt={item.name}
                //   className="m-auto h-24 w-24 object-contain"
                //   width={100}
                //   loading="lazy"
                //   height={100}
                // />
              )}
            </div>
            <div className="p-3 flex flex-col">
              <div
                className={`flex flex-row justify-start gap-3 text-fuchsia-500`}
              >
                <p
                  className={`text-[10px] font-normal ${
                    item.availability == "AVAILABLE"
                      ? "text-fuchsia-500"
                      : "text-red-500"
                  } border border-black px-1`}
                >
                  {item.availability}
                </p>
                <p
                  className={`
                  text-xs font-normal overflow-hidden whitespace-nowrap
                  `}
                >
                  {thousandSeparator(item.views) + " dilihat"}
                </p>
              </div>
              <p className={`font-bold`}>{item.name}</p>
              <div>
                <CustomButton
                  classname={"btn-xs text-center px-5"}
                  type="button"
                  boxShadow="3px 3px"
                  onClick={() => {
                    router.push(`collection/${item.id}`);
                    addViewCollection(item.id);
                  }}
                >
                  Detail
                </CustomButton>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center">No collection found</p>
      )}
    </div>
  );
};

export default Collection;
