import { ErrorMessage, Field, Form, Formik } from "formik";
import Modal from "../Modal";
import CustomButton from "@/components/button/customButton";
import { useState } from "react";
import * as Yup from "yup";
import { GetLocationResponseArray } from "@/types/location";
import { toast } from "sonner";
import axios from "axios";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataLocation: GetLocationResponseArray | [];
  reFetchData: () => void;
}

export default function ModalAddRack({
  isOpen,
  onClose,
  dataLocation,
  reFetchData,
}: ModalProps) {
  const [modalKey, setModalKey] = useState(0);
  const [initialValues, setInitialValues] = useState({
    name: "",
    locationId: "",
    description: "",
  });

  const validation = Yup.object({
    name: Yup.string().required("Rack name is required"),
    locationId: Yup.string().required("Rack location is required"),
    description: Yup.string()
      .max(255, "Description is too long")
      .min(5, "Description is too short"),
  });

  const handleClose = () => {
    onClose();
    setModalKey((prevKey) => prevKey + 1);
    setInitialValues({
      name: "",
      locationId: "",
      description: "",
    });
  };

  const handleSubmit = async (values: any) => {
    const data = {
      name: values.name,
      description: values.description,
      locationId: +values.locationId,
    };

    try {
      await axios
        .post("/api/v1/rack", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          toast.success(res.data.message);
          reFetchData();
          handleClose();
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
      buttonCloseActive={false}
      modalTitle="Add New Rack"
      isOpen={isOpen}
      onClose={handleClose}
      key={modalKey}
    >
      <div className="flex flex-col gap-4">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validation}
          onSubmit={async (values, action) => {
            await handleSubmit(values);
            action.setSubmitting(false);
          }}
        >
          {({ values, handleChange, handleBlur, isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rack Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  autoComplete="off"
                  placeholder="Rack Name"
                  className="mt-1 block w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 block w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                  id="description"
                  placeholder="Description"
                ></textarea>
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="locationId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <Field
                  as="select"
                  type="text"
                  id="locationId"
                  name="locationId"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.locationId}
                  autoComplete="off"
                  className="mt-1 block w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                >
                  <option value="">Select Location</option>
                  {dataLocation?.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="locationId"
                  component="div"
                  className="text-red-500"
                />
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
