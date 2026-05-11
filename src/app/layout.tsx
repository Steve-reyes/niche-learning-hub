import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Learn Online Job - Free Courses & Resources for VA Niches",
  description:
    "744 hand-picked resources across 15 VA niches. 398 free courses, certificates, and masterclasses.",
  openGraph: {
    title: "Learn Online Job",
    description:
      "Pick your niche. Start learning. For free. 744 hand-picked resources across 15 VA niches.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
