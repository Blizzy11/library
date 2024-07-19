"use client";

import { AiFillInstagram, AiOutlineRead } from "react-icons/ai";
import CustomButton from "../button/customButton";
import { FaGlobe, FaSquareXTwitter } from "react-icons/fa6";
import { toast } from "sonner";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-900 py-6 md:p-10">
      <div className="flex flex-col items-center justify-center gap-4 border-b border-white pb-4">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 px-3 w-full">
          <div>
            <p className="text-2xl text-white font-semibold border-b border-white pb-2 flex items-center gap-2">
              <AiOutlineRead />
              Library
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <p className="text-white font-normal">About</p>
            <p className="text-white font-normal">Contact</p>
            <p className="text-white font-normal">Process</p>
          </div>

          <div className="md:flex hidden gap-4 text-white">
            <span className="tooltip" data-tip="Instagram">
              <AiFillInstagram size={20} />
            </span>
            <span className="tooltip" data-tip="Website">
              <FaGlobe size={20} />
            </span>
            <span className="tooltip" data-tip="Twitter">
              <FaSquareXTwitter size={20} />
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 px-3 w-full md:py-6">
          <div className="flex flex-col gap-4 w-full justify-center items-center md:justify-start md:items-start">
            <div className="bg-fuchsia-500 p-1 text-white md:w-fit">
              Contact Us :
            </div>
            <div className="flex font-normal text-sm flex-col gap-2 justify-center items-center w-1/2 text-center text-white md:items-start md:text-left">
              <p>Email : 0iXp3@example.com</p>
              <p>Phone : 08123456789</p>
              <p>Address : Jl. Cempaka Putih No. 123, Jakarta</p>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-3 p-6 bg-gray-800 w-10/12 rounded-md">
            <input
              type="text"
              name="name"
              placeholder="Email"
              autoComplete="off"
              className="input input-bordered w-full max-w-xs text-white bg-transparent border-white focus:border-fuchsia-500"
            />
            <CustomButton
              type="submit"
              classname="py-2 px-4 w-full max-w-xs bg-white md:w-auto hover:bg-black hover:text-white transition duration-500 ease-in-out"
              onClick={() => {
                toast.warning("This feature is not available yet");
              }}
            >
              Subscribe to our news
            </CustomButton>
          </div>
        </div>

        <div className="flex flex-row gap-5 py-5 justify-center items-center text-white md:hidden">
          <span className="tooltip" data-tip="Instagram">
            <AiFillInstagram size={20} />
          </span>
          <span className="tooltip" data-tip="Website">
            <FaGlobe size={20} />
          </span>
          <span className="tooltip" data-tip="Twitter">
            <FaSquareXTwitter size={20} />
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center pt-6">
        <p className="text-white text-center font-normal text-sm w-1/2">
          © 2023 Library era bangun. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
