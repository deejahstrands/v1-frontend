import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${satoshi.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
