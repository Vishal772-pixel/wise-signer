import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";
import Footer from "@/components/Footer";
import { Providers } from './providers'

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
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}