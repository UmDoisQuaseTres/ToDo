import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "../components/theme-provider";

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
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <SessionWrapper>
            <Header />
            <Toaster closeButton={true} />
            {children}
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
