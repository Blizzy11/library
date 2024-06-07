"use client";
import axios from "axios";
import { use, useEffect, useState } from "react";
import CustomSearch from "../search/customSearch";
import CustomSelect from "../select/customSelect";
import Paagination from "../pagination/pagination";
import { FcEmptyTrash } from "react-icons/fc";
import RainbowLoading from "../loading/rainbowLoading";

interface TableProps {
  data?: any[];
  dataHeader: any[];
  url: string;
}

export default function Table(props: TableProps) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const dataHeader = props.dataHeader;
  const option = [
    { value: "available", label: "Avaliable" },
    { value: "borrow", label: "Borrow" },
    { value: "lost", label: "Lost" },
  ];

  // getData item
  const getData = async () => {
    const res = await axios.get(
      `${props.url}?page=${page}&limit=10&search=${searchTerm}`
    );
    setData(res.data.data);
    setIsLoading(false);
  };

  // useEffect
  useEffect(() => {
    getData();
  }, [searchTerm, page]);

  // const handleSearch = (value: string) => {
  //   const filteredData = data.filter((item) => {
  //     // Leverage dataHeader for dynamic filtering
  //     return dataHeader.some((header) => {
  //       const key = header.key;
  //       // Handle nested key structures (e.g., item.rack.name)
  //       const itemValue = key
  //         .split(".")
  //         .reduce((acc: any, current: any) => acc[current], item);
  //       return (
  //         itemValue && itemValue.toLowerCase().includes(value.toLowerCase())
  //       );
  //     });
  //   });
  //   setData(filteredData);
  // };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page on new search
  };

  return (
    <div className={"flex flex-col gap-5"}>
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
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={dataHeader.length + 2} className="text-center">
                  <span className="loading loading-infinity loading-lg"></span>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item, index) => {
                return (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    {dataHeader.map((column, columnIndex) => {
                      return (
                        <td key={columnIndex}>
                          {column.type === "image" ? (
                            <img
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
              <tr>
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
          <Paagination page={page} setPage={setPage} totalPage={data.length} />
        </div>
      </div>
    </div>
  );
}
