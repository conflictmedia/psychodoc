import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: '400',
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drugucopia - Psychoactive Substances Documentation",
  description: "Documentation for psychoactive substances including effects, dosages, harm reductioni.",
  keywords: ["psychoactive", "substances", "documentation", "harm reduction", "drug information"],
  authors: [{ name: "conflictmedia @ conflict@cocaine.ninja" }],
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
//        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        className={`${ibmPlexSans.className} ${ibmPlexMono.className} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
