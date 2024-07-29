"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";

const adminMenu = [
  {
    name: "Dashboard",
    link: "/admin",
  },
  {
    name: "Transaction",
    link: "/admin/transaction",
  },
  {
    name: "User List",
    link: "/admin/user",
  },
  {
    name: "Library",
    link: "/admin/library",
    submenu: [
      {
        name: "Collection",
        link: "/admin/library/collection",
      },
      {
        name: "Category",
        link: "/admin/library/category",
      },
      {
        name: "Rack",
        link: "/admin/library/rack",
      },
      {
        name: "Location",
        link: "/admin/library/location",
      },
    ],
  },
  {
    name: "Settings",
    link: "/admin/setting",
    submenu: [
      {
        name: "Profile",
        link: "/admin/setting/profile",
      },
    ],
  },
];

const userMenu = [
  {
    name: "Dashboard",
    link: "/app",
  },
  {
    name: "Collection List",
    link: "/app/collection",
  },
  {
    name: "Transaction History",
    link: "/app/transaction",
  },
  {
    name: "Library",
    link: "/app/library",
    submenu: [
      {
        name: "My Collection",
        link: "/app/library/collection",
      },
      {
        name: "My Transaction",
        link: "/app/library/transaction",
      },
      // {
      //   name: "Rack",
      //   link: "/app/library/rack",
      // },
      // {
      //   name: "Location",
      //   link: "/app/library/location",
      // },
    ],
  },
  {
    name: "Settings",
    link: "/app/setting",
    submenu: [
      {
        name: "Profile",
        link: "/app/setting/profile",
      },
    ],
  },
];

interface NavbarProps {
  role?: string;
}

const Navbar = ({ role }: NavbarProps) => {
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
                <AiOutlineMenu size={28} />
              ) : (
                <IoCloseSharp size={28} />
              )}
            </div>
            <div>
              <Image
                src="/icon/logo.png"
                alt="logo"
                width={65}
                height={65}
                className="cursor-pointer object-contain"
              />
            </div>
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
            {role === "ADMIN" ? (
              <>
                {adminMenu.map(
                  (item, index) =>
                    (item.submenu && (
                      <li key={index}>
                        <details>
                          <summary>{item.name}</summary>
                          <ul>
                            {item.submenu.map((subItem, index) => (
                              <li key={index}>
                                <Link
                                  href={subItem.link}
                                  className="text-gray-700"
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </details>
                      </li>
                    )) || (
                      <li key={index}>
                        <Link href={item.link} className="text-gray-700">
                          {item.name}
                        </Link>
                      </li>
                    )
                )}
                {/* <li>
                  <Link href={"/admin/dashboard"} className="text-gray-700">
                    Dashboard
                  </Link>
                </li>

                <li>
                  <Link href={"/admin/transaction"} className="text-gray-700">
                    Transaction
                  </Link>
                </li>

                <li>
                  <Link href={"/admin/user"} className="text-gray-700">
                    User List
                  </Link>
                </li>

                <li>
                  <details>
                    <summary>Library</summary>
                    <ul>
                      <li>
                        <Link href={"/admin/library/collection"}>
                          Collection
                        </Link>
                      </li>
                      <li>
                        <Link href={"/admin/library/category"}>Category</Link>
                      </li>
                      <li>
                        <Link href={"/admin/library/rack"}>Rack</Link>
                      </li>
                      <li>
                        <Link href={"/admin/library/location"}>Location</Link>
                      </li>
                    </ul>
                  </details>
                </li>

                <li>
                  <details>
                    <summary>settings</summary>
                    <ul>
                      <li>
                        <Link href={"/admin/setting/profile"}>Profile</Link>
                      </li>
                    </ul>
                  </details>
                </li> */}
              </>
            ) : (
              <>
                {userMenu.map(
                  (item, index) =>
                    (item.submenu && (
                      <li key={index}>
                        <details>
                          <summary>{item.name}</summary>
                          <ul>
                            {item.submenu.map((subItem, index) => (
                              <li key={index}>
                                <Link
                                  href={subItem.link}
                                  className="text-gray-700"
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </details>
                      </li>
                    )) || (
                      <li key={index}>
                        <Link href={item.link} className="text-gray-700">
                          {item.name}
                        </Link>
                      </li>
                    )
                )}
                {/* <li>
                  <Link href={"/user/dashboard"} className="text-gray-700">
                    Dashboard
                  </Link>
                </li>

                <li>
                  <Link href={"/app/collection"} className="text-gray-700">
                    Collection List
                  </Link>
                </li>

                <li>
                  <Link href={"/app/transaction"} className="text-gray-700">
                    Transaction
                  </Link>
                </li>

                <li>
                  <details>
                    <summary>Settings</summary>
                    <ul>
                      <li>
                        <Link
                          href={"/app/setting/profile"}
                          className="text-gray-700"
                        >
                          Profile
                        </Link>{" "}
                      </li>
                      <li>
                        <a>History</a>
                      </li>
                      <li>
                        <a>Favorite Collection</a>
                      </li>
                    </ul>
                  </details>
                </li> */}
              </>
            )}

            <li>
              <button
                type="submit"
                onClick={() => {
                  signOut();
                }}
              >
                Sign out
              </button>
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
