"use client";

import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Event handler untuk toggling menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="w-full z-50 fixed top-0">
        <div className="w-100 flex justify-between items-center p-5 border-b border-black bg-white">
          <div className="flex items-center gap-2">
            <div className="sm:hidden cursor-pointer" onClick={toggleMenu}>
              {!isMenuOpen ? (
                <svg
                  className="swap-off fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 512 512"
                >
                  <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                </svg>
              ) : (
                <svg
                  className="swap-on fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 512 512"
                >
                  <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
              )}
            </div>
            <h1 className="text-3xl font-bold border border-black p-2">Logo</h1>
          </div>
          <div>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 z-50 w-1/2 h-full bg-white shadow-lg transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="">
          <h2 className="p-5 text-xl font-bold mb-5">Menu</h2>
          <ul className="space-y-4 menu">
            <li>
              <Link href={"/admin/dashboard"} className="text-gray-700">
                Dashboard
              </Link>
            </li>

            <li>
              <details>
                <summary>Library</summary>
                <ul>
                  <li>
                    <Link href={"/admin/library/book"}>Collection</Link>
                  </li>
                  <li>
                    <Link href={"/admin/library"}>Authors</Link>
                  </li>
                </ul>
              </details>
            </li>

            <li>
              <details>
                <summary>User</summary>
                <ul>
                  <li>
                    <a>User</a>
                  </li>
                  <li>
                    <a>User History</a>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay background to close menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
};

export default Navbar;
