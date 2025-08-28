import type { Metadata } from "next";
import "./globals.css";
import { NetworkProvider } from "@/components/NetworkProvider";
import GoogleAnalytics from "./GoogleAnalytics";
import { ThemeProvider } from "next-themes";

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
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning avoids mismatch between SSR/CSR */}
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system" // can be "dark" | "light" | "system"
          enableSystem
          disableTransitionOnChange
        >
          <GoogleAnalytics />
          <NetworkProvider>{children}</NetworkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
