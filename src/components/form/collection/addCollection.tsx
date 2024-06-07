"use client";
import CustomButton from "@/components/button/customButton";
import RainbowLoading from "@/components/loading/rainbowLoading";
import axios from "axios";
import { Field, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

const AddCollectionForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [category, setcategory] = useState([]);
  const [rack, setrack] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const formValidation = Yup.object().shape({
    name: Yup.string()
      .required("Collection name is required")
      .min(3, "Too short"),
    description: Yup.string().required("Description is required"),
    rackId: Yup.string().required("Rack is required"),
    categoryId: Yup.string().required("Category is required"),
    // imageCover: Yup.mixed().required("Image is required"),
  });

  // get category
  const getCategory = async () => {
    setIsLoading(true);
    try {
      const res = axios.get("/api/v1/category");
      const { data } = await res;
      setcategory(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  // get rack
  const getRack = async () => {
    setIsLoading(true);
    try {
      const res = axios.get("/api/v1/rack");
      const { data } = await res;
      setrack(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategory();
    getRack();
  }, []);

  const handleSubmit = async (values: any) => {
    const data = {
      name: values.name,
      description: values.description,
      rackId: values.rackId,
      categoryId: values.categoryId,
      imageCover: values.imageCover,
    };
    try {
      const response = await axios.post("/api/v1/collection", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  // is loading true
  if (isLoading) {
    return <RainbowLoading />;
  }

  return (
    <div>
      <Formik
        initialValues={{
          name: "",
          description: "",
          rackId: "",
          categoryId: "",
          imageCover: null,
        }}
        validationSchema={formValidation}
        onSubmit={(values, { setSubmitting }) => {
          values.imageCover = (file?.name as any) || null;
          // console.log(values);
          handleSubmit(values)
            .then((res) => {
              toast.success(res?.data.message);
            })
            .catch((error) => {
              toast.error("Error adding collection");
            })
            .finally(() => {
              setSubmitting(false);
            });

          // reset form after submitting uing formik
          router.refresh();
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
                {errors.name && touched.name && (
                  <div className="text-red-500">{errors.name}</div>
                )}
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
                {errors.description && touched.description && (
                  <div className="text-red-500">{errors.description}</div>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className={"block text-sm font-semibold text-black"}
              >
                Rack
              </label>
              <div className={"mt-1"}>
                <Field
                  as="select"
                  name="rackId"
                  className="select border border-black bordered w-full"
                  value={values.rackId}
                  onChange={handleChange}
                >
                  <option value={""} className="text-white">
                    Select Rack
                  </option>
                  {rack?.map((item: any) => (
                    <option
                      key={item.id}
                      value={item.id}
                      className="text-white"
                    >
                      {item.name}
                    </option>
                  ))}
                </Field>
                {errors.rackId && touched.rackId && (
                  <div className="text-red-500">{errors.rackId}</div>
                )}
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
                {errors.categoryId && touched.categoryId && (
                  <div className="text-red-500">{errors.categoryId}</div>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className={"block text-sm font-semibold text-black"}
              >
                Image Cover
              </label>
              <div className={"mt-1"}>
                <Field
                  as="input"
                  name="imageCover"
                  type="file"
                  className="file-input file-input-md w-full border border-black"
                  onChange={(e: any) => {
                    console.log(e.target.files[0]);
                    setFile(e.target.files[0]);
                  }}
                  accept="image/*"
                />
                {errors.imageCover && touched.imageCover && (
                  <div className="text-red-500">{errors.imageCover}</div>
                )}
              </div>
            </div>
            <div>
              <CustomButton
                disabled={isSubmitting}
                type="submit"
                bgColor="black"
                color="white"
              >
                {isSubmitting ? (
                  <span className="loading loading-dots loading-sm"></span>
                ) : (
                  "Submit"
                )}
              </CustomButton>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default AddCollectionForm;
