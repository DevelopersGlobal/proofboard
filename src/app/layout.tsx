import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "ProofBoard - launches ranked on proof", template: "%s | ProofBoard" },
  description: "A product launch board where domain-verified products outrank unverified ones, and votes only move you within your evidence band.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-neutral-50 text-neutral-900">
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
