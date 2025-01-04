import { ThemeProvider } from "@/components/theme-provider";

import type { Metadata } from "next";
import { Geist, Azeret_Mono as Geist_Mono } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TripletAI - Supervised Learning Triplets Management",
  description:
    "Efficiently manage and curate your supervised learning triplets with TripletAI.",
  keywords: [
    "TripletAI",
    "Supervised Learning",
    "AI Training Data",
    "Machine Learning",
    "Data Management",
    "AI Model Training",
    "Triplets",
  ],
  openGraph: {
    title: "TripletAI - Supervised Learning Triplets Management",
    description:
      "Efficiently manage and curate your supervised learning triplets with TripletAI.",
    url: "https://yourdomain.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TripletAI - Supervised Learning Triplets Management",
    description:
      "Efficiently manage and curate your supervised learning triplets with TripletAI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster position="top-center" richColors closeButton />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
