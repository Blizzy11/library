"use client";
import axios from "axios";
import { use, useEffect, useState } from "react";
import CustomSearch from "../search/customSearch";
import CustomSelect from "../select/customSelect";
import Pagination from "../pagination/pagination";
import { toast } from "sonner";
import CustomButton from "../button/customButton";
import Modal from "../modal/Modal";
import Image from "next/image";

interface TableProps {
  data?: any[];
  dataHeader: any[];
  url: string;
  modalChildren?: React.ReactNode;
  addTextButton?: string;
}

export default function Table(props: TableProps) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  const dataHeader = props.dataHeader;
  const option = [
    { value: "available", label: "Avaliable" },
    { value: "borrow", label: "Borrow" },
    { value: "lost", label: "Lost" },
  ];

  // getData item
  const getData = async () => {
    await axios
      .get(`${props.url}?page=${page}&limit=10&search=${searchTerm}`)
      .then((res) => {
        setData(res.data.data);
        setTotalPage(res.data.pagination.totalPage);
      })
      .catch((err) => {
        toast.error(err.response.data.message || "Something went wrong");
      });
    setIsLoading(false);
  };

  // useEffect
  useEffect(() => {
    getData();
  }, [searchTerm, page]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page on new search
  };

  return (
    <div className={"flex flex-col gap-5"}>
      {props.modalChildren && (
        <div>
          <CustomButton
            type="button"
            text={props.addTextButton}
            classname="py-2 px-3"
            onClick={() => setOpenModal(true)}
          />
          <Modal
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
            modalTitle={props.addTextButton || "Add"}
            // children={props.modalChildren}
          >
            {props.modalChildren}
          </Modal>
        </div>
      )}
      <div className={"flex flex-row-reverse justify-between"}>
        <div>
          <CustomSearch placeholder="Search..." onChange={handleSearch} />
        </div>
        <div>
          <CustomSelect data={option} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table border border-black">
          {/* head */}
          <thead>
            <tr className="border border-black">
              <th></th>
              {dataHeader.map((item, index) => {
                return <th key={index}>{item.label}</th>;
              })}
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="border border-black">
            {isLoading ? (
              <tr className="border-b border-black">
                <td colSpan={dataHeader.length + 2} className="text-center">
                  <span className="loading loading-infinity loading-lg"></span>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item, index) => {
                return (
                  <tr key={index} className={`border-b border-black`}>
                    <th>{index + 1}</th>
                    {dataHeader.map((column, columnIndex) => {
                      return (
                        <td key={columnIndex}>
                          {column.type === "image" ? (
                            <Image
                              width={50}
                              height={50}
                              src={item[column.key]}
                              alt={(item as any).name}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : column.key.includes(".") ? (
                            item[column.key.split(".")[0]][
                              column.key.split(".")[1]
                            ]
                          ) : (
                            item[column.key]
                          )}
                        </td>
                      );
                    })}
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
                <td colSpan={dataHeader.length + 2} className="text-center">
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
    </div>
  );
}
