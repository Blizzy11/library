"use client";
import axios from "axios";
import { use, useEffect, useState } from "react";
import CustomSearch from "../search/customSearch";
import CustomSelect from "../select/customSelect";
import Pagination from "../pagination/pagination";
import { toast } from "sonner";
import CustomButton from "../button/customButton";
import Modal from "../modal/Modal";
import { GetLocationResponseArray } from "@/types/location";
import ModalAddFormLocation from "../modal/modalComponent/modalAddFormLocation";
import { ModalEditLocation } from "../modal/modalComponent/modalEditLocation";
import { AiOutlinePlus } from "react-icons/ai";

interface TableProps {}

export default function TableLocation(props: TableProps) {
  const [data, setData] = useState<GetLocationResponseArray>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );

  // getData item
  const getData = async () => {
    await axios
      .get(`/api/v1/location?page=${page}&limit=10&search=${searchTerm}`)
      .then((res) => {
        setData(res.data.data);
        setTotalPage(res.data.pagination.totalPage);
      })
      .catch((err) => {
        toast.error(err.response.data.message || "Something went wrong");
      });
    setIsLoading(false);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page on new search
  };

  // useEffect
  useEffect(() => {
    getData();
  }, [searchTerm, page]);

  return (
    <div className={"flex flex-col gap-5"}>
      <div>
        <CustomButton
          type="button"
          classname="py-2 px-3"
          onClick={() => setOpenModal(true)}
        >
          <div className="flex gap-2 items-center">
            Add Location <AiOutlinePlus />
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
              <th>Name</th>
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
                          setEditModal(true);
                          setSelectedLocationId(item.id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm bg-black text-white hover:bg-fuchsia-500 hover:text-white"
                        onClick={() => {
                          setDeleteModal(true);
                          setSelectedLocationId(item.id);
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

      <ModalAddFormLocation
        reFetchData={getData}
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      />
      <DeleteLocation
        reFetchData={getData}
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        locationId={selectedLocationId!}
      />
      <ModalEditLocation
        reFetchData={getData}
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        locationId={selectedLocationId!}
      />
    </div>
  );
}

interface ModalDeleteFormLocationProps {
  reFetchData: () => void;
  isOpen: boolean;
  onClose: () => void;
  locationId: number;
}
function DeleteLocation({
  reFetchData,
  isOpen,
  onClose,
  locationId,
}: ModalDeleteFormLocationProps) {
  const handleDelete = async () => {
    try {
      await axios
        .delete(`/api/v1/location/`, {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            id: locationId,
          },
        })
        .then((res) => {
          toast.success(res.data.message);
          reFetchData();
        })
        .catch((error) => {
          toast.error(error.response.data.message || "Something went wrong");
        });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Modal
      buttonCloseActive={false}
      modalTitle="Delete Location"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <h1>Are you sure you want to delete this location?</h1>
        <div className="flex flex-row justify-end gap-4">
          <CustomButton
            type="button"
            text="Delete"
            classname="py-2 px-3"
            onClick={handleDelete}
          />
          <CustomButton
            type="button"
            text="Cancel"
            classname="py-2 px-3"
            onClick={onClose}
          />
        </div>
      </div>
    </Modal>
  );
}
