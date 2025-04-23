import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Wise Signer",
  description: "Can you sign the transactions correctly?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-900 text-white">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}