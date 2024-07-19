"use client";

import CustomButton from "@/components/button/customButton";
import CustomSearch from "@/components/search/customSearch";
import { thousandSeparator } from "@/helper/helper";
import { CollectionData, GetCollectionResponse } from "@/types/collection";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsHddRackFill } from "react-icons/bs";
import { FaBook, FaEye } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";
import { toast } from "sonner";

const Collection = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [collection, setCollection] = useState<CollectionData[]>([]);
  const [data, setData] = useState<GetCollectionResponse | null>(null);
  const [page, setPage] = useState(1);
  const [querySearch, setQuerySearch] = useState("");

  // get collection
  const getCollection = async (reset: boolean = false) => {
    try {
      await axios
        .get("/api/v1/collection", {
          params: {
            page: page,
            limit: 10,
            search: querySearch,
          },
        })
        .then((res) => {
          setCollection((prev) => {
            if (reset) {
              return res.data.data;
            } else {
              return [...prev, ...res.data.data];
            }
          });

          setData(res.data);
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
    // Fetch data pertama kali atau ketika `getStatusParams` berubah, reset data
    getCollection(true);
  }, [querySearch]);

  useEffect(() => {
    if (page > 1) {
      getCollection();
    }
  }, [page]);

  return (
    <div className={`flex flex-col gap-4`}>
      <div>
        {" "}
        <CustomSearch placeholder="Search..." setState={setQuerySearch} />
      </div>
      {isLoading && page === 1 ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-dots loading-sm"></span>
        </div>
      ) : collection.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collection.map((item) => (
            <div
              className="flex flex-col border p-3 border-black gap-4"
              key={item.id}
            >
              <div className="flex flex-row justify-between border-b border-black pb-2">
                <div className="flex gap-3 items-center">
                  <FaBook />
                  <span className="capitalize text-sm">{item.name}</span>
                </div>
                <div>
                  <span className="capitalize text-xs border border-black p-1">
                    {item.availability}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex flex-col">
                  <p className="text-xs flex gap-2 items-center">
                    <IoLocation />
                    {item.rack.location.name}
                  </p>
                  <p className="text-xs flex gap-2 items-center">
                    <BsHddRackFill />
                    {item.rack.name}
                  </p>
                  <p className="text-xs flex gap-2 items-center">
                    <FaEye />
                    {item.views.toLocaleString()} dilihat
                  </p>
                </div>
                <div className="flex flex-row flex-wrap justify-end gap-3">
                  <CustomButton
                    type="button"
                    boxShadow="3px 3px"
                    classname="px-2 py-1 text-sm"
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
          ))}
        </div>
      ) : (
        <p className="text-center">No collection found</p>
      )}

      {isLoading && page > 1 && (
        <div className="flex justify-center">
          <span className="loading loading-dots loading-sm"></span>
        </div>
      )}
      {page < (data?.pagination?.totalPage ?? 0) && (
        <div className="self-center">
          <CustomButton
            type="button"
            classname="px-3 py-1"
            onClick={() =>
              setPage((prev) => {
                return prev + 1;
              })
            }
          >
            Load More
          </CustomButton>
        </div>
      )}
    </div>
  );
};

export default Collection;
