import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { AuthProvider } from "@/components/providers/AuthProvider";
import Navbar from "@/components/Navbar";
import AiChat from "@/components/AiChat";

import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Rent-A-Car",
  description: "Premium Car Rental Service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
          <Footer />
          <AiChat />
        </AuthProvider>
      </body>
    </html>
  );
}
