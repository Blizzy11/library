"use client";
import CustomButton from "@/components/button/customButton";
import RainbowLoading from "@/components/loading/rainbowLoading";
import { GetCategoryResponseArray } from "@/types/category";
import { GetCollectionByIdResponse } from "@/types/collection";
import { GetRackResponseArray } from "@/types/rack";
import axios from "axios";
import dayjs from "dayjs";
import { ErrorMessage, Field, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

interface CollectionFormProps {
  // reFetchData: () => void;
  data?: GetCollectionByIdResponse;
}

const CollectionForm = ({ data }: CollectionFormProps) => {
  // Get uer session
  const { data: session } = useSession();

  const [file, setFile] = useState<File | null>(null);
  const [category, setcategory] = useState<GetCategoryResponseArray>([]);
  const [location, setLocation] = useState<GetRackResponseArray>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const [initialValues, setInitialValues] = useState({
    name: data?.name || "",
    number: data?.number || "",
    description: data?.description || "",
    rack_name: data?.rack_name || "",
    locationId: data?.locationId || "",
    categoryId: data?.categoryId || "",
    imageCover: "",
  });

  const formValidation = Yup.object().shape({
    name: Yup.string()
      .required("Collection name is required")
      .min(3, "Too short"),
    number: Yup.string().required("Collection number is required"),
    description: Yup.string().required("Description is required"),
    rack_name: Yup.string().required("Rack is required"),
    locationId: Yup.string().required("Rack is required"),
    categoryId: Yup.string().required("Category is required"),
    // imageCover: Yup.mixed().required("Image is required"),
  });

  // get category
  const getCategory = async () => {
    setIsLoading(true);
    try {
      const res = axios.get("/api/v1/category");
      const { data } = await res;
      setcategory(data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  // get rack
  const getLocatioin = async () => {
    setIsLoading(true);
    try {
      const res = axios.get("/api/v1/location");
      const { data } = await res;
      setLocation(data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategory();
    getLocatioin();
  }, []);

  const handleSubmit = async (values: any, action: any) => {
    console.log("values", values);
    const value: any = {
      name: values.name,
      number: values.number,
      description: values.description,
      rack_name: values.rack_name,
      locationId: values.locationId,
      categoryId: values.categoryId,
      imageCover: values.imageCover,
    };

    if (data?.id) {
      value.updatedBy = session?.user.id;
      value.updatedAt = dayjs().toISOString();
    } else {
      value.createdBy = session?.user.id;
    }

    try {
      if (data?.id) {
        await axios
          .put(`/api/v1/collection`, value, {
            params: {
              id: data?.id,
            },
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            toast.success(res.data.message);
            // action.resetForm();
            router.refresh();
          })
          .catch((error) => {
            toast.error(error.response.data.message || error.message);
          });
      } else {
        await axios
          .post("/api/v1/collection", value, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            console.log(res);
            toast.success(res.data.message);
            action.resetForm();
            // router.refresh();
          })
          .catch((error) => {
            console.log(error);
            toast.error(error.response.data.message || error.message);
          });
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    action.setSubmitting(false);
  };

  // is loading true
  if (isLoading) {
    return <RainbowLoading />;
  }

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={formValidation}
        onSubmit={(values, action) => {
          values.imageCover = (file?.name as any) || null;
          handleSubmit(values, action);
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          isSubmitting,
          errors,
          touched,
        }) => (
          <form onSubmit={handleSubmit} className={"flex flex-col gap-4 p-4"}>
            <div>
              <label
                htmlFor="name"
                className={"block text-sm font-semibold text-black"}
              >
                Collection Name
              </label>
              <div className={"mt-1"}>
                <Field
                  type="text"
                  name="name"
                  placeholder="Collection Name"
                  id="name"
                  value={values.name}
                  onChange={handleChange}
                  autoComplete="off"
                  className={
                    "border border-black p-2 w-full rounded-md focus:outline-none focus:border-fuchsia-500"
                  }
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="number"
                className={"block text-sm font-semibold text-black"}
              >
                Collection Number
              </label>
              <div className={"mt-1"}>
                <Field
                  type="text"
                  name="number"
                  placeholder="Collection Number"
                  id="number"
                  value={values.number}
                  onChange={handleChange}
                  autoComplete="off"
                  className={
                    "border border-black p-2 w-full rounded-md focus:outline-none focus:border-fuchsia-500"
                  }
                />
                <ErrorMessage
                  name="number"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="rack_name"
                className={"block text-sm font-semibold text-black"}
              >
                Rack Name
              </label>
              <div className={"mt-1"}>
                <Field
                  type="text"
                  name="rack_name"
                  placeholder="Enter Rack Name"
                  id="rack_name"
                  value={values.rack_name}
                  onChange={handleChange}
                  autoComplete="off"
                  className={
                    "border border-black p-2 w-full rounded-md focus:outline-none focus:border-fuchsia-500"
                  }
                />
                <ErrorMessage
                  name="rack_name"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className={"block text-sm font-semibold text-black"}
              >
                Description
              </label>
              <div className={"mt-1"}>
                <Field
                  as="textarea"
                  rows={5}
                  name="description"
                  placeholder="Description"
                  id="description"
                  value={values.description}
                  onChange={handleChange}
                  autoComplete="off"
                  className={
                    "border border-black p-2 w-full rounded-md focus:outline-none focus:border-fuchsia-500"
                  }
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="locationId"
                className={"block text-sm font-semibold text-black"}
              >
                Location
              </label>
              <div className={"mt-1"}>
                <Field
                  as="select"
                  name="locationId"
                  className="select border border-black bordered w-full"
                  value={values.locationId}
                  onChange={handleChange}
                >
                  <option value={""} className="text-white">
                    Select Location
                  </option>
                  {location?.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      className="text-white"
                    >
                      {`${item.name}`}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="locationId"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className={"block text-sm font-semibold text-black"}
              >
                Category
              </label>
              <div className={"mt-1"}>
                <Field
                  as="select"
                  name="categoryId"
                  className="select border border-black bordered w-full"
                  value={values.categoryId}
                  onChange={handleChange}
                >
                  <option value={""} className="text-white">
                    Select Category
                  </option>
                  {category?.map((item: any) => (
                    <option
                      key={item.id}
                      value={item.id}
                      className="text-white"
                    >
                      {item.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="categoryId"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className={"block text-sm font-semibold text-black"}
              >
                Image Cover{" "}
                <span className="text-red-500 text-[9px]">Tidak wajib</span>
              </label>
              <div className={"mt-1"}>
                <Field
                  as="input"
                  name="imageCover"
                  type="file"
                  className="file-input file-input-md w-full border border-black"
                  onChange={(e: any) => {
                    setFile(e.target.files[0]);
                  }}
                  accept="image/*"
                />
                {errors.imageCover && touched.imageCover && (
                  <div className="text-red-500">{errors.imageCover}</div>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <CustomButton
                disabled={isSubmitting}
                type="submit"
                classname="py-2 px-3"
              >
                {isSubmitting ? (
                  <span className="loading loading-dots loading-sm"></span>
                ) : (
                  "Submit"
                )}
              </CustomButton>

              <CustomButton
                disabled={isSubmitting}
                type="button"
                classname="py-2 px-3"
                onClick={() => {
                  router.back();
                }}
              >
                {isSubmitting ? (
                  <span className="loading loading-dots loading-sm"></span>
                ) : (
                  "Back"
                )}
              </CustomButton>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default CollectionForm;
