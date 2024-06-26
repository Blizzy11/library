import { auth } from "@/auth";
import Navbar from "@/components/sidebar/navbar";
import Sidebar from "@/components/sidebar/sidebar";
import { SessionProvider } from "next-auth/react";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <Navbar role={session?.user.role?.toString()} />
      <div className="flex">
        <Sidebar />
        <div></div>
        <div className="flex-1 p-5 md:p-10 lg:p-10 sm:ml-64 mt-20">
          {children}
        </div>
      </div>
    </SessionProvider>
  );
}
