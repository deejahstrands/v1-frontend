import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/common/header";
import { ClientFooterWrapper } from "@/components/common/client-footer-wrapper";

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

export const metadata: Metadata = {
  title: "Deejah Strands",
  description: "Luxury in hairs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${satoshi.variable} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 pb-[72px] md:pb-0">
          {children}
        </main>
        <ClientFooterWrapper />
      </body>
    </html>
  );
}
