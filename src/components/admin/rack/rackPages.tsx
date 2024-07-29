"use client";

import CustomButton from "@/components/button/customButton";
import ModalAddRack from "@/components/modal/modalComponent/modalAddRack";
import Pagination from "@/components/pagination/pagination";
import CustomSearch from "@/components/search/customSearch";
import CustomSelect from "@/components/select/customSelect";
import { GetLocationResponseArray } from "@/types/location";
import { GetRackResponseArray } from "@/types/rack";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "sonner";

export default function RackPages() {
  const [data, setData] = useState<GetRackResponseArray>([]);
  const [dataLocation, setDataLocation] = useState<GetLocationResponseArray>(
    []
  );
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  // getData item
  const getData = useCallback(async () => {
    try {
      await axios
        .get(`/api/v1/rack?page=${page}&limit=10&search=${searchTerm}`)
        .then((res) => {
          setData(res.data.data);
          setTotalPage(res.data.pagination.totalPage);
        })
        .catch((err) => {
          toast.error(err.response.data.message || err.message);
        });
    } catch (error) {
      toast.error("Something went wrong");
    }
    setIsLoading(false);
  }, [page, searchTerm]);

  const getDataLocation = useCallback(async () => {
    try {
      await axios
        .get("/api/v1/location")
        .then((res) => {
          setDataLocation(res.data.data);
        })
        .catch((err) => {
          toast.error(err.response.data.message || err.message);
        });
    } catch (error) {
      toast.error("Something went wrong");
    }
    setIsLoading(false);
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page on new search
  };

  // useEffect
  useEffect(() => {
    getData();
    getDataLocation();
  }, [searchTerm, page, getData, getDataLocation]);

  return (
    <div className={"flex flex-col gap-5"}>
      <div>
        <CustomButton
          type="button"
          classname="py-2 px-3"
          onClick={() => setOpenModal(true)}
        >
          <div className="flex gap-2 items-center">
            Add Rack <AiOutlinePlus />
          </div>
        </CustomButton>
      </div>
      <div className={"flex flex-row-reverse justify-between"}>
        <div>
          <CustomSearch placeholder="Search..." onChange={handleSearch} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table border border-black">
          {/* head */}
          <thead>
            <tr className="border border-black">
              <th></th>
              <th>Rack Name</th>
              <th>Rack Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="border border-black">
            {isLoading ? (
              <tr className="border-b border-black">
                <td colSpan={4} className="text-center">
                  <span className="loading loading-infinity loading-lg"></span>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item, index) => {
                return (
                  <tr key={index} className={`border-b border-black`}>
                    <th>{index + 1}</th>
                    <td>{item.name}</td>
                    <td>{item.location.name}</td>
                    <td>
                      <button
                        className="btn btn-sm bg-black text-white hover:bg-fuchsia-500 hover:text-white"
                        onClick={() => {}}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm bg-black text-white hover:bg-fuchsia-500 hover:text-white"
                        onClick={() => {}}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-b border-black">
                <td colSpan={4} className="text-center">
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className={"flex flex-row-reverse"}>
        <div>
          <Pagination page={page} setPage={setPage} totalPage={totalPage} />
        </div>
      </div>

      <ModalAddRack
        reFetchData={getData}
        dataLocation={dataLocation}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}
