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
            <Toaster 
  theme="system" 
  closeButton={true}
  className="dark:text-white text-black"
  toastOptions={{
    classNames: {
      toast: "dark:bg-gray-800 dark:text-white text-black bg-white",
      description: "dark:text-gray-200 text-gray-800",
      actionButton: "dark:text-white text-black",
      cancelButton: "dark:text-white text-black",
    }
  }}
/>
            {children}
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
