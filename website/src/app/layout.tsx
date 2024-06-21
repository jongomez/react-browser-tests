import { CustomSidebarLayout } from "@/components/CustomSidebarLayout";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "React Browser Tests",
  description: "Browser first testing lib",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CustomSidebarLayout>
          {children}
        </CustomSidebarLayout>
      </body>
    </html>
  );
}
