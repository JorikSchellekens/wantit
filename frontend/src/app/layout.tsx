'use client'

import "./globals.css";
import '@/styles/globals.css'
import Providers from './providers'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import localFont from "next/font/local";

const coinbaseSans = localFont({
  src: [
    {
      path: "./fonts/Coinbase-Sans/Coinbase_Sans-Regular-web-1.32.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Coinbase-Sans/Coinbase_Sans-Bold-web-1.32.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-coinbase-sans",
});

const coinbaseMono = localFont({
  src: [
    {
      path: "./fonts/Coinbase-Mono/Coinbase_Mono-Light-web.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Coinbase-Mono/Coinbase_Mono-Regular-web.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Coinbase-Mono/Coinbase_Mono-Medium-web.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Coinbase-Mono/Coinbase_Mono-Bold-web.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-coinbase-mono",
});

const burguesScript = localFont({
  src: [
    {
      path: "./fonts/burgues-script-regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-burgues-script",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${coinbaseMono.variable} ${coinbaseSans.variable} ${burguesScript.variable} font-sans`}>
        <Providers>{children}</Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
