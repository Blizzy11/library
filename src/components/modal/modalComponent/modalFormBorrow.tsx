import React, { use, useState } from "react";
import Modal from "../Modal";
import { Form, Formik } from "formik";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CustomButton from "@/components/button/customButton";
import * as Yup from "yup";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import axios from "axios";
import { GetTransactionDetailResponse } from "@/types/transaction";
import { GetUserProfileResponse } from "@/types/user";
import { generateAdminApprovalMessage, sendMessage } from "@/helper/helper";

interface ModalFormBorrowProps {
  isOpen: boolean;
  onClose: () => void;
  collectionId: string;
  dataCollectionApproved?: GetTransactionDetailResponse;
  dataAdminUserForSendNotification?: GetUserProfileResponse[];
}

const ModalFormBorrow = ({
  isOpen,
  onClose,
  collectionId,
  dataCollectionApproved,
  dataAdminUserForSendNotification,
}: ModalFormBorrowProps) => {
  // get session
  const isSession = useSession();
  const { data: session } = isSession;

  // state
  const [modalKey, setModalKey] = useState(0); // State untuk mengatur ulang komponen Modal
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    descripiton: "",
    startDate: dataCollectionApproved?.returnDate
      ? dataCollectionApproved?.returnDate
      : dayjs().toISOString(),
    endDate: dataCollectionApproved?.returnDate
      ? dataCollectionApproved?.returnDate
      : dayjs().toISOString(),
  });

  // Form Validation
  const formValidation = Yup.object().shape({
    descripiton: Yup.string().required("Description is required"),
    startDate: Yup.date().required("Start Date is required"),
    endDate: Yup.date().required("End Date is required"),
  });

  // Handle Close Modal
  const handleCloseModal = () => {
    // Set ulang initialValues Formik
    setInitialValues({
      descripiton: "",
      startDate: dataCollectionApproved?.returnDate
        ? dataCollectionApproved?.returnDate
        : dayjs().toISOString(),
      endDate: dataCollectionApproved?.returnDate
        ? dataCollectionApproved?.returnDate
        : dayjs().toISOString(),
    });
    // Atur key modal untuk memaksa React membuat ulang komponen Modal
    setModalKey((prevKey) => prevKey + 1);
    onClose();
  };

  // Send message to admin when request approved
  const handleSendMessage = () => {
    dataAdminUserForSendNotification?.map((data) => {
      const dataMessage = generateAdminApprovalMessage({
        adminName: data.username,
        userName: session?.user.name || "",
        collectionTitle: dataCollectionApproved?.item.name || "",
        borrowDate: dayjs(initialValues.startDate)
          .format("DD MMMM YYYY")
          .toString(),
        returnDate: dayjs(initialValues.endDate)
          .format("DD MMMM YYYY")
          .toString(),
      });

      sendMessage(dataMessage, data.phone?.toString() || "");
    });
  };

  // Handle Submit
  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    if (!session) {
      return toast.error("You must be relogin");
    }

    if (!collectionId) {
      return toast.error("Collection Id is required");
    }

    const data = {
      userId: session.user.id,
      itemId: collectionId,
      description: values.descripiton,
      borrowDate: values.startDate,
      returnDate: values.endDate,
    };

    try {
      await axios
        .post("/api/v1/transaction/borrow", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          toast.success(res.data.message);
          if (dataAdminUserForSendNotification?.length ?? 0 > 0) {
            handleSendMessage();
          }
          handleCloseModal();
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } catch (error) {
      toast.error("Something went wrong");
    }

    setIsLoading(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        modalTitle="Form Borrow"
        key={modalKey}
      >
        <div className={` border p-5 border-black`}>
          {/* Form Borrow */}
          <Formik
            validationSchema={formValidation}
            initialValues={initialValues}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              /* and other goodies */
            }) => (
              <Form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3">
                  <div className="">
                    <label
                      htmlFor="descripiton"
                      className="block text-sm font-medium text-black "
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="descripiton"
                      onBlur={handleBlur}
                      value={values.descripiton}
                      onChange={handleChange}
                      autoComplete="off"
                      rows={5}
                      className="mt-1 block w-full text-black border border-black bg-white px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                    />
                    {errors.descripiton && touched.descripiton ? (
                      <div className="text-red-500">{errors.descripiton}</div>
                    ) : null}
                  </div>

                  <div className="">
                    <label
                      htmlFor="descripiton"
                      className="block text-sm font-medium text-black "
                    >
                      Start Date Borrow
                    </label>
                    <MobileDatePicker
                      defaultValue={dayjs()}
                      value={dayjs(values.startDate)}
                      minDate={
                        dataCollectionApproved?.returnDate
                          ? dayjs(dataCollectionApproved?.returnDate)
                          : dayjs()
                      }
                      onChange={(date) => {
                        handleChange({
                          target: { name: "startDate", value: date },
                        });
                      }}
                      className="w-full border border-black ring-black bg-white rounded-md"
                    />
                    {errors.startDate && touched.startDate ? (
                      <div className="text-red-500">{errors.startDate}</div>
                    ) : null}
                  </div>

                  <div className="">
                    <label
                      htmlFor="descripiton"
                      className="block text-sm font-medium text-black "
                    >
                      End Date Borrow
                    </label>
                    <MobileDatePicker
                      minDate={dayjs()}
                      name="endDate"
                      value={
                        dataCollectionApproved?.returnDate
                          ? dayjs(dataCollectionApproved?.returnDate)
                          : dayjs(values.endDate)
                      }
                      onChange={(date) => {
                        handleChange({
                          target: { name: "endDate", value: date },
                        });
                      }}
                      className="w-full border border-black ring-black bg-white rounded-md"
                    />
                    {errors.endDate && touched.endDate ? (
                      <div className="text-red-500">{errors.endDate}</div>
                    ) : null}
                  </div>
                  <CustomButton
                    disabled={isLoading}
                    type="submit"
                    classname="bg-white py-2"
                  >
                    {isLoading ? (
                      <span className="loading loading-dots loading-sm"></span>
                    ) : (
                      "Submit"
                    )}
                  </CustomButton>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </LocalizationProvider>
  );
};

export default ModalFormBorrow;
