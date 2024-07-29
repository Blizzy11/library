import { Field, Form, Formik } from "formik";
import Modal from "../Modal";
import CustomButton from "@/components/button/customButton";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { GetLocationResponse } from "@/types/location";

interface ModalEditLocationProps {
  isOpen: boolean;
  onClose: () => void;
  reFetchData: () => void;
  locationId: number;
}

export function ModalEditLocation({
  isOpen,
  onClose,
  reFetchData,
  locationId,
}: ModalEditLocationProps) {
  const [dataLoading, setDataLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Location Name is required"),
  });

  const handleClose = () => {
    onClose();
    setInitialValues({
      name: "",
    });
  };

  const getLocationById = async () => {
    setDataLoading(true);
    try {
      setDataLoading(true);
      await axios
        .get(`/api/v1/location`, {
          params: {
            id: locationId,
          },
        })
        .then((res) => {
          setInitialValues({
            name: res.data.data[0].name,
          });
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        })
        .finally(() => {
          setDataLoading(false);
        });
    } catch (error) {
      toast.error("Something went wrong");
    }
    setDataLoading(false);
  };

  const handleSubmitUpdate = async (values: any) => {
    try {
      await axios
        .put("/api/v1/location", values, {
          params: {
            id: locationId,
          },
        })
        .then((res) => {
          toast.success(res.data.message);
          reFetchData();
          handleClose();
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (locationId && isOpen) {
      getLocationById();
    }
  }, [locationId, isOpen]);

  return (
    <Modal
      buttonCloseActive={false}
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Edit Location"
    >
      {dataLoading ? (
        <span className="loading loading-dots loading-sm"></span>
      ) : (
        <div className="flex flex-col gap-4">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, action) => {
              handleSubmitUpdate(values);
              action.setSubmitting(false);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
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
      )}
    </Modal>
  );
}
