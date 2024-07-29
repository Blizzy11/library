"use client";

import CustomButton from "@/components/button/customButton";
import Modal from "@/components/modal/Modal";
import ModalAddCategory from "@/components/modal/modalComponent/modalAddCategory";
import ModalAddRack from "@/components/modal/modalComponent/modalAddRack";
import Pagination from "@/components/pagination/pagination";
import CustomSearch from "@/components/search/customSearch";
import CustomSelect from "@/components/select/customSelect";
import { GetCategoryResponseArray } from "@/types/category";
import { GetLocationResponseArray } from "@/types/location";
import { GetRackResponseArray } from "@/types/rack";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "sonner";

export default function CategoryPage() {
  const router = useRouter();
  const [data, setData] = useState<GetCategoryResponseArray>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(0);

  // getData item
  const getData = useCallback(async () => {
    setIsLoading(true);
    try {
      await axios
        .get(`/api/v1/category?page=${page}&limit=10&search=${searchTerm}`)
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

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page on new search
  };

  // useEffect
  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className={"flex flex-col gap-5"}>
      <div>
        <CustomButton
          type="button"
          classname="py-2 px-3"
          onClick={() => setOpenModal(true)}
        >
          <div className="flex gap-2 items-center">
            Add Cattegory <AiOutlinePlus />
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
              <th>Category Name</th>
              <th>Status</th>
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
                    <td>{item.is_active ? "Active" : "Inactive"}</td>
                    <td>
                      <button
                        className="btn btn-sm bg-black text-white hover:bg-fuchsia-500 hover:text-white"
                        onClick={() => {
                          router.push(
                            `/admin/library/category?id=${item.id}`,
                            undefined
                          );
                          setOpenModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm bg-black text-white hover:bg-fuchsia-500 hover:text-white"
                        onClick={() => {
                          setDeleteModal(true);
                          setSelectedId(item.id);
                        }}
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

      <ModalAddCategory
        reFetchData={getData}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />

      <DeleteCategoryModal
        reFetchData={getData}
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        id={selectedId}
      />
    </div>
  );
}

interface DeleteCategoryModalProps {
  reFetchData: () => void;
  isOpen: boolean;
  onClose: () => void;
  id: number;
}

function DeleteCategoryModal({
  reFetchData,
  isOpen,
  onClose,
  id,
}: DeleteCategoryModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalTitle={"Delete Category"}
      buttonCloseActive={false}
    >
      <div className="flex flex-col gap-3">
        <div>
          <p>Are you sure want to delete this category?</p>
        </div>
        <div className="flex justify-end gap-4">
          <CustomButton
            type="button"
            classname="btn btn-sm text-black hover:bg-fuchsia-500 hover:text-white"
            onClick={onClose}
          >
            Cancel
          </CustomButton>
          <CustomButton
            type="button"
            classname="btn btn-sm text-black hover:bg-fuchsia-500 hover:text-white"
            onClick={async () => {
              await axios
                .delete(`/api/v1/category`, {
                  data: {
                    id: id,
                  },
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                .then(() => {
                  reFetchData();
                  toast.success("Category deleted successfully");
                  onClose();
                })
                .catch((err) => {
                  toast.error(err.response.data.message || err.message);
                });
            }}
          >
            Delete
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
}
