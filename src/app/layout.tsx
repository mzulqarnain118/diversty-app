import * as React from "react";
import ThemeRegistry from "@/ThemeRegistry/ThemeRegistry";
import NextAuthProvider from "@/contexts/NextAuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmProvider from "@/contexts/ConfirmProvider";
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  title: "Next.js App Router",
  description: "Next.js App Router",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <ThemeRegistry>
            <ConfirmProvider>{children}</ConfirmProvider>
          </ThemeRegistry>
        </NextAuthProvider>
        <ToastContainer />
        <SpeedInsights />
      </body>
    </html>
  );
}
