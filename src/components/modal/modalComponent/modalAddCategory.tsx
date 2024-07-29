import { ErrorMessage, Field, Form, Formik } from "formik";
import Modal from "../Modal";
import CustomButton from "@/components/button/customButton";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { GetLocationResponseArray } from "@/types/location";
import { toast } from "sonner";
import axios from "axios";
import { useSearchParams } from "next/navigation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  reFetchData: () => void;
}

export default function ModalAddCategory({
  isOpen,
  onClose,
  reFetchData,
}: ModalProps) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(true);
  const [modalKey, setModalKey] = useState(0);
  const [initialValues, setInitialValues] = useState({
    name: "",
  });

  const validation = Yup.object({
    name: Yup.string().required("Rack name is required"),
  });

  const handleClose = () => {
    onClose();
    setModalKey((prevKey) => prevKey + 1);
    setInitialValues({
      name: "",
    });

    window.history.replaceState(null, "", window.location.pathname); // Mengembalikan URL ke keadaan semula
  };

  const handleSubmit = async (values: any) => {
    try {
      await axios
        .post("/api/v1/category", values, {
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

  const handleUpdate = async (values: any, id: number) => {
    const data = {
      name: values.name,
      id: id,
    };
    try {
      await axios
        .put("/api/v1/category", data, {
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

  const getCategoryById = async (id: number) => {
    setIsLoading(true);
    try {
      await axios
        .get(`/api/v1/category`, {
          params: {
            id: id,
          },
        })
        .then((res) => {
          setInitialValues({
            name: res.data.data[0].name,
          });
        })
        .catch((error) => {
          toast.error(error.response.data.message || error.message);
        });
    } catch (error) {
      toast.error("Something went wrong");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (id) {
      getCategoryById(+id);
    }
    setIsLoading(false);
  }, [searchParams]);

  return (
    <Modal
      buttonCloseActive={false}
      modalTitle={`${id ? "Edit" : "Add"} Category`}
      isOpen={isOpen}
      onClose={handleClose}
      key={modalKey}
    >
      {isLoading ? (
        <span className="loading loading-dots loading-sm"></span>
      ) : (
        <div className="flex flex-col gap-4">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validation}
            onSubmit={async (values, action) => {
              if (id) {
                await handleUpdate(values, +id);
                action.setSubmitting(false);
              } else {
                await handleSubmit(values);
              }
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
                    Category Name
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
