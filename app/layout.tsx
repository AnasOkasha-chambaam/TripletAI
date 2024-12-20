// /app/layout.tsx

import { ThemeProvider } from "@/components/theme-provider";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TripletAI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TripletAI - Supervised Learning Triplets Management",
    description:
      "Efficiently manage and curate your supervised learning triplets with TripletAI.",
    images: [
      {
        url: "https://yourdomain.com/twitter-image.jpg",
        alt: "TripletAI",
      },
    ],
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
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <Toaster position="top-center" richColors closeButton />
            </>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
