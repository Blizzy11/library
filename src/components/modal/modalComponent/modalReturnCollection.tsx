import React from "react";
import Modal from "../Modal";
import { useSearchParams } from "next/navigation";
import CustomButton from "@/components/button/customButton";
import { toast } from "sonner";
import axios from "axios";

interface ModalReturnFormCollectionProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalReturnFormCollection = ({
  isOpen,
  onClose,
}: ModalReturnFormCollectionProps) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("transactionId");

  const handleClose = () => {
    onClose();
    window.history.replaceState(null, "", window.location.pathname);
  };

  const returnCollection = async () => {
    try {
      await axios
        .post(`/api/v1/transaction/borrow/returnCollection`, {
          transactionId: id,
        })
        .then((res) => {
          toast.success(res.data.message);
          handleClose();
        })
        .catch((error) => {
          toast.error(error.response.data.message || error.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () => {
    if (!id) {
      return toast.error("Try again later");
    }
    returnCollection();
  };

  return (
    <Modal
      modalTitle="Return Confirmation"
      isOpen={isOpen}
      onClose={handleClose}
      buttonCloseActive={false}
    >
      <div className="flex flex-col">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to return this collection?
          </p>
        </div>
        <div className="flex justify-end mt-4 gap-4">
          <CustomButton
            type="button"
            classname={`px-3 py-1`}
            onClick={handleClose}
          >
            Cancel
          </CustomButton>
          <CustomButton
            type="button"
            classname={`px-3 py-1`}
            onClick={handleSubmit}
          >
            Return
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
};

export default ModalReturnFormCollection;
