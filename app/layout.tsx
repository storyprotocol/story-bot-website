import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "./providers";
import { getSession } from "@/auth";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

// If needed, uncomment and customize the metadata
export const metadata: Metadata = {
  title: "Story bot",
  description: "A website for the Story Discord bot.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers session={session}>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
