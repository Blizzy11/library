"use client";

import { toast } from "sonner";
import CustomButton from "@/components/button/customButton";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import axios from "axios";

const SignUpPage = () => {
  /**
   * Form Validation
   */
  const formValidation = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone_number: Yup.string().required("Phone number is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    confirm_password: Yup.string()
      .required("Confirm password is required.")
      .oneOf([Yup.ref("password")], "Your passwords do not match."),
  });

  /**
   * Handle Signup API
   * @param value {username, email, password, phone_number}
   */
  const handleSignup = async (value: any, action: () => void) => {
    await axios
      .post("/api/auth/register", value)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          action();
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96 flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-center text-black">SignUp</h1>

        <Formik
          initialValues={{
            username: "",
            password: "",
            email: "",
            phone_number: "",
            confirm_password: "",
          }}
          validationSchema={formValidation}
          onSubmit={async (values, action) => {
            await handleSignup(values, action.resetForm);
            action.setSubmitting(false);

            // reset form
            // action.resetForm();
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
                  value={values.username}
                  autoComplete="off"
                  className="mt-1 block w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                />
                {errors.username && touched.username ? (
                  <div className="text-red-500">{errors.username}</div>
                ) : null}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="NIK"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  autoComplete="off"
                  className="mt-1 block w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                />
                {errors.email && touched.email ? (
                  <div className="text-red-500">{errors.email}</div>
                ) : null}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="NIK"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone_number}
                  autoComplete="off"
                  className="mt-1 block w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                />
                {errors.phone_number && touched.phone_number ? (
                  <div className="text-red-500">{errors.phone_number}</div>
                ) : null}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="NIK"
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
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.confirm_password}
                  autoComplete="off"
                  className="mt-1 block w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                />
                {errors.confirm_password && touched.confirm_password ? (
                  <div className="text-red-500">{errors.confirm_password}</div>
                ) : null}
              </div>
              <CustomButton
                classname="w-full py-1 px-2"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-dots loading-sm"></span>
                ) : (
                  "Sign Up"
                )}
              </CustomButton>
            </Form>
          )}
        </Formik>

        {/* Login with */}
        <div>
          <span>
            You have an account?{" "}
            <Link
              href="/signin"
              className="text-blue-800 underline underline-offset-2"
            >
              Sign In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
