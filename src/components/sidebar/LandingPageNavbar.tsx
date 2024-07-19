"use client";

import { generateWhatsAppMessage, sendMessage } from "@/helper/helper";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  AiOutlineApi,
  AiOutlineArrowRight,
  AiOutlineExclamationCircle,
  AiOutlineFileText,
  AiOutlineMenu,
  AiOutlineRead,
} from "react-icons/ai";
import { toast } from "sonner";

const menu = [
  {
    name: "About",
    icon: <AiOutlineApi />,
    link: "/",
  },
  {
    name: "Documentation",
    icon: <AiOutlineFileText />,
    link: "/",
  },
  {
    name: "Contact",
    icon: <AiOutlineExclamationCircle />,
    link: "/",
  },
];

export default function LandingPageNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`p-5 z-50 border-b-[0.5px] border-black fixed top-0 left-0 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white bg-opacity-50 backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div className="flex flex-row justify-between">
        <div>
          <p className="text-2xl font-bold flex items-center gap-2">
            <AiOutlineRead />
            Library
          </p>
        </div>
        <div>
          {/* <AiOutlineMenu size={30} className="text-black cursor-pointer" /> */}
          <div className="drawer drawer-end md:hidden">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              {/* Page content here */}
              <label htmlFor="my-drawer">
                <AiOutlineMenu
                  size={30}
                  className="text-black cursor-pointer"
                />
              </label>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 gap-4">
                {/* Sidebar content here */}
                {menu.map((item, index) => (
                  <li key={index}>
                    <a className="text-black hover:bg-fuchsia-500 rounded-none hover:text-white transition-all ease-in-out duration-300">
                      {item.icon} {item.name}
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    href={"/signin"}
                    className="bg-fuchsia-500 rounded-none text-white hover:bg-fuchsia-600 transition-all ease-in-out duration-300"
                  >
                    Login <AiOutlineArrowRight />
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/signup"}
                    className="border border-black rounded-none text-black hover:bg-black hover:text-white transition-all ease-in-out duration-300"
                  >
                    Sign Up <AiOutlineApi />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="hidden md:flex">
            <ul className="menu menu-horizontal p-0 gap-4">
              {menu.map((item, index) => (
                <li key={index}>
                  <a className="text-black hover:bg-fuchsia-500 rounded-none hover:text-white transition-all ease-in-out duration-300">
                    {item.icon} {item.name}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href={"/signin"}
                  className="bg-fuchsia-500 rounded-none text-white hover:bg-fuchsia-600 transition-all ease-in-out duration-300"
                >
                  Login <AiOutlineArrowRight />
                </Link>
              </li>
              <li>
                <a className="border border-black rounded-none text-black hover:bg-black hover:text-white transition-all ease-in-out duration-300">
                  Sign Up <AiOutlineApi />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
