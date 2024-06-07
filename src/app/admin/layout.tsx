import Navbar from "@/components/sidebar/navbar";
import Sidebar from "@/components/sidebar/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div></div>
        <div className="flex-1 p-10 sm:ml-64 mt-20">{children}</div>
      </div>
    </>
  );
}
