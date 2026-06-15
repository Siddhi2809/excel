import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Jisnu Digital | Reporting Portal",
  description: "Next-gen marketing report submission and tracking system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} light`}>
      <body className="font-sans min-h-screen flex flex-col bg-background text-foreground">
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
