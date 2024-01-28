import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";

const roboto = Roboto_Condensed({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ToDoApp",
  description: "Get the control of your life",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en" className="bg-gray-100">
        <body className={roboto.className}>
          <Header />
          {children}
        </body>
      </html>
    </SessionWrapper>
  );
}
