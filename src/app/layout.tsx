import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster, toast } from "sonner";
import { GeistSans } from "geist/font/sans";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EMS - Library",
  description: "Library Management System For Easy Access and Management",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "EMS - Library",
    description: "Library Management System For Easy Access and Management",
    url: "https://ems.library.ugm.ac.id/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="cupcake" className={GeistSans.className}>
      {/* <body className={inter.className}> */}
      <body>
        <Toaster position="top-right" richColors />
        {/* <Sidebar /> */}
        <div>{children}</div>
      </body>
    </html>
  );
}
