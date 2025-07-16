import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LayoutWrapper } from "@/components/common/layout-wrapper";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const satoshi = localFont({
  src: [
    {
      path: '../assets/fonts/TTF/Satoshi-Variable.ttf',
      weight: '300 900',
      style: 'normal',
    },
    {
      path: '../assets/fonts/TTF/Satoshi-VariableItalic.ttf',
      weight: '300 900',
      style: 'italic',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
});

const ethereal = localFont({
  src: [
    {
      path: '../assets/fonts/OTF/ethereal-demo.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-ethereal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Deejah Strands",
  description: "Luxury in hairs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${satoshi.variable} ${ethereal.variable} antialiased min-h-screen flex flex-col`}>
        <LayoutWrapper>{children}</LayoutWrapper>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
