"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

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

const Sidebar = ({ role }: NavbarProps) => {
  return (
    <>
      {/* <div className="flex"> */}
      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full border-r border-black sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 pt-6 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium menu rounded-box">
            {role === "ADMIN"
              ? adminMenu.map((item, index) =>
                  item.submenu ? (
                    <li key={item.name}>
                      <details>
                        <summary className=" text-gray-900 rounded-lg dark:text-white hover:bg-fuchsia-500 hover:text-white dark:hover:bg-fuchsia-500">
                          <span>{item.name}</span>
                        </summary>
                        <ul className="space-y-2 pl-4">
                          {item.submenu.map((submenu) => (
                            <li key={submenu.name}>
                              <Link
                                href={submenu.link}
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <span>{submenu.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </li>
                  ) : (
                    <li>
                      <Link
                        href={item.link}
                        className="flex items-center text-gray-900 rounded-lg dark:text-white hover:bg-fuchsia-500 hover:text-white dark:hover:bg-fuchsia-500"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  )
                )
              : userMenu.map((item, index) =>
                  item.submenu ? (
                    <li key={item.name}>
                      <details>
                        <summary className=" text-gray-900 rounded-lg dark:text-white hover:bg-fuchsia-500 hover:text-white dark:hover:bg-fuchsia-500">
                          <span>{item.name}</span>
                        </summary>
                        <ul className="space-y-2 pl-4">
                          {item.submenu.map((submenu) => (
                            <li key={submenu.name}>
                              <Link
                                href={submenu.link}
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <span>{submenu.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </li>
                  ) : (
                    <li key={item.name}>
                      <Link
                        href={item.link}
                        className="flex items-center text-gray-900 rounded-lg dark:text-white hover:bg-fuchsia-500 hover:text-white dark:hover:bg-fuchsia-500"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  )
                )}
            <li>
              <div
                onClick={() => {
                  signOut();
                }}
                className="flex items-center text-gray-900 rounded-lg dark:text-white hover:bg-fuchsia-500 hover:text-white dark:hover:bg-fuchsia-500"
              >
                <span>Sign Out</span>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      {/* <div className="flex-1 p-10 ml-64 mt-20">
          <h2 className="text-2xl font-bold mb-5">Main Content</h2>
          <p>This is the main content area. You can add more content here.</p>
        </div> */}
      {/* </div> */}
    </>
  );
};

export default Sidebar;
