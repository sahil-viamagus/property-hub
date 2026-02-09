import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Property Hub Haryana",
    default: "Property Hub Haryana | Buy Flats, Plots & Luxury Villas",
  },
  description: "Haryana's most trusted real estate platform. Discover premium residential and commercial properties in Hisar, Gurugram, and across Haryana. Integrity. Luxury. Scale.",
  keywords: ["Properties in Hisar", "Haryana Real Estate", "Flats in Gurugram", "Buy Plots in Haryana", "Luxury Villas Hisar", "Property Hub Haryana"],
  authors: [{ name: "Property Hub Admin" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
