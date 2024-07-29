"use client";

import CustomButton from "@/components/button/customButton";
import { GetUserProfileResponse } from "@/types/user";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { toast } from "sonner";
import * as Yup from "yup";

interface ProfileUpdateProps {
  data: GetUserProfileResponse;
  refetch?: () => void;
}

export default function ProfileUpdate({ data, refetch }: ProfileUpdateProps) {
  const [isLoading, setIsloading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    username: data.username || "",
    email: data.email || "",
    name: data.name || "",
    phone_number: data.phone || "",
    birthDate: data.birthDate ? dayjs(data.birthDate).format() : null, // Format as string
  });

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    name: Yup.string(),
    phone_number: Yup.string()
      .matches(phoneRegExp, "Phone number is not valid")
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number must not exceed 15 characters"),
  });

  const handleSubmitUpdate = async (values: any) => {
    setIsloading(true);
    try {
      await axios
        .put("/api/v1/user", values, {
          params: {
            userId: data.id,
          },
        })
        .then((res) => {
          toast.success(res.data.message);
          // refetch();
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } catch (error) {
      toast.error("Something went wrong");
    }

    setIsloading(false);
  };

  const isValuesChanged = (values: any) => {
    return (
      values.username !== initialValues.username ||
      values.email !== initialValues.email ||
      values.name !== initialValues.name ||
      values.phone_number !== initialValues.phone_number ||
      values.birthDate !== initialValues.birthDate
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        className={`border border-black p-5 flex flex-col justify-center items-center mt-5`}
      >
        <p className={`font-bold text-lg md:text-xl lg:text-2xl`}>Profile</p>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validateOnChange={true}
          validationSchema={validationSchema}
          onSubmit={async (values, action) => {
            if (isValuesChanged(values)) {
              handleSubmitUpdate(values);
            } else {
              toast.error("No changes made");
            }

            if (refetch) {
              refetch();
            }
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
            <Form className={`flex flex-col gap-3 w-full`}>
              <div className="mb-4">
                <label
                  htmlFor="NIK"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  onChange={(e) => {
                    // Remove spaces from the value
                    const valueWithoutSpaces = e.target.value.replace(
                      /\s+/g,
                      ""
                    );
                    handleChange({
                      ...e,
                      target: {
                        ...e.target,
                        value: valueWithoutSpaces,
                        name: "username",
                      },
                    });
                  }}
                  onBlur={handleBlur}
                  value={values.username ?? ""}
                  autoComplete="off"
                  className="mt-1 block w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                />
                {errors.username && touched.username ? (
                  <div className="text-red-500">{errors.username}</div>
                ) : null}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name ?? ""}
                  autoComplete="off"
                  className="mt-1 block w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                />
                {errors.name && touched.name ? (
                  <div className="text-red-500">{errors.name}</div>
                ) : null}
              </div>

              <div className="relative mb-4 bg-transparent">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="email"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    autoComplete="off"
                    className="mt-1 block bg-transparent w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                  />
                  {/* {isEmailVerified && ( */}
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500">
                    <AiFillCheckCircle size={20} />
                  </span>
                  {/* )} */}
                </div>
                {errors.email && touched.email ? (
                  <div className="text-red-500">{errors.email}</div>
                ) : null}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  onChange={(e) => {
                    // only number
                    const value = e.target.value.replace(/[^0-9]/g, "");

                    handleChange({
                      ...e,
                      target: {
                        ...e.target,
                        value,
                        name: e.target.name,
                      },
                    });
                  }}
                  onBlur={handleBlur}
                  value={values.phone_number ?? ""}
                  autoComplete="off"
                  className="mt-1 block w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                />
                {errors.phone_number && touched.phone_number ? (
                  <div className="text-red-500">{errors.phone_number}</div>
                ) : null}
              </div>

              <div className="">
                <label
                  htmlFor="descripiton"
                  className="block text-sm font-medium text-black "
                >
                  Birth Date
                </label>
                <MobileDatePicker
                  maxDate={dayjs()}
                  name="birthDate"
                  value={values.birthDate ? dayjs(values.birthDate) : null}
                  onChange={(date) => {
                    handleChange({
                      target: {
                        name: "birthDate",
                        value: date?.format(),
                      },
                    });
                  }}
                  className="mt-1 w-full bg-transparent border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                />
                {errors.birthDate && touched.birthDate ? (
                  <div className="text-red-500">{errors.birthDate}</div>
                ) : null}
              </div>

              <div className={``}>
                <CustomButton
                  disabled={isSubmitting}
                  type="submit"
                  classname="px-3 py-2 w-full"
                >
                  {isSubmitting ? (
                    <span className="loading loading-dots loading-sm"></span>
                  ) : (
                    "Update"
                  )}
                </CustomButton>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </LocalizationProvider>
  );
}
