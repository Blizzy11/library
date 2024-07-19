"use client";

import Link from "next/link";

const adminMenu = [
  {
    name: "Dashboard",
    link: "/admin/dashboard",
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
    link: "/user/dashboard",
  },
  {
    name: "Transaction",
    link: "/user/transaction",
  },
  {
    name: "Settings",
    link: "/user/setting",
    submenu: [
      {
        name: "Profile",
        link: "/user/setting/profile",
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
          <ul className="space-y-2 font-medium">
            {role === "ADMIN"
              ? adminMenu.map((item, index) =>
                  item.submenu ? (
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
                  ) : (
                    <li key={item.name}>
                      <Link
                        href={item.link}
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
                        <summary>
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
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  )
                )}
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <span className="ms-3">Sign Out</span>
              </a>
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
