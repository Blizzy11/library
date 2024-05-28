"use client";

import axios from "axios";
import { useState } from "react";

export const LoginPage = () => {
  const [dataLogin, setDataLogin] = useState({
    nik: "",
    password: "",
  });

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const res = await axios.post("/api/v1/auth/login", {
      nik: dataLogin.nik,
      password: dataLogin.password,
    });
    console.log(res.data);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-bold text-center text-black">Login</h1>
        <form className="mt-4" method="POST" onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="NIK"
              className="block text-sm font-medium text-gray-700"
            >
              NIK
            </label>
            <input
              type="text"
              id="nik"
              name="nik"
              onChange={(e) => {
                setDataLogin({ ...dataLogin, nik: e.target.value });
              }}
              required
              autoComplete="off"
              className="mt-1 block w-full bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
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
              required
              className="mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => {
                setDataLogin({ ...dataLogin, password: e.target.value });
              }}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
