"use client";

import CustomButton from "@/components/button/customButton";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import Modal from "../Modal";
import axios from "axios";
import { toast } from "sonner";

interface ModalAddFormLocationProps {
  isOpen: boolean;
  onClose: () => void;
  reFetchData: () => void;
}

export default function ModalAddFormLocation({
  isOpen,
  onClose,
  reFetchData,
}: ModalAddFormLocationProps) {
  const [modalKey, setModalKey] = useState(0);
  const [initialValues, setInitialValues] = useState({
    name: "",
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Location Name is required"),
  });

  const handleClose = () => {
    setInitialValues({
      name: "",
    });

    setModalKey((prevKey) => prevKey + 1);
    onClose();
  };

  // Handle Submit
  const handleSubmit = async (values: any) => {
    try {
      await axios
        .post("/api/v1/location", values, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          toast.success(res.data.message);
          handleClose();
          reFetchData();
        })
        .catch((error) => {
          toast.error(error.response.data.message || error.message);
        });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      modalTitle="Location"
      key={modalKey}
    >
      <div className="flex flex-col gap-4">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, action) => {
            handleSubmit(values);
            action.setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  autoComplete="off"
                  className="mt-1 block w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                />
                {errors.name && touched.name ? (
                  <div className="text-red-500">{errors.name}</div>
                ) : null}
              </div>
              <div className={`flex flex-col gap-4`}>
                <CustomButton
                  disabled={isSubmitting}
                  classname="w-full py-2"
                  type="submit"
                >
                  {isSubmitting ? (
                    <span className="loading loading-dots loading-sm"></span>
                  ) : (
                    "Submit"
                  )}
                </CustomButton>

                <CustomButton
                  disabled={isSubmitting}
                  classname="w-full py-2"
                  type="button"
                  onClick={handleClose}
                >
                  {isSubmitting ? (
                    <span className="loading loading-dots loading-sm"></span>
                  ) : (
                    "Cancel"
                  )}
                </CustomButton>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}
