"use client";

import { signIn } from "next-auth/react";
import { toast } from "sonner";
import CustomButton from "@/components/button/customButton";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Link from "next/link";

export const LoginPage = () => {
  const formValidation = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = async (value: any) => {
    // e.preventDefault();

    const response = await signIn("credentials", {
      // redirectTo: "/admin",
      redirect: false,
      username: value.username,
      password: value.password,
    });

    if (response?.error) {
      toast.error(response.error);
    } else {
      toast.success("Login success");

      // reload page
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96 flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-center text-black">Login</h1>

        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          validationSchema={formValidation}
          onSubmit={async (values, { setSubmitting }) => {
            await handleLogin(values);
            setSubmitting(false);
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
            <Form className="">
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
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                  autoComplete="off"
                  className="mt-1 block w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                />
                {errors.username && touched.username ? (
                  <div className="text-red-500">{errors.username}</div>
                ) : null}
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  autoComplete="off"
                  className="mt-1 block w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                />
                {errors.password && touched.password ? (
                  <div className="text-red-500">{errors.password}</div>
                ) : null}
              </div>
              <CustomButton
                classname="w-full py-2"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-dots loading-sm"></span>
                ) : (
                  "Sign in"
                )}
              </CustomButton>
            </Form>
          )}
        </Formik>

        {/* Create account when need */}
        <div>
          <span>
            You don't have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-800 underline underline-offset-2"
            >
              Create account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
