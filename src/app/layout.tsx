import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { SyncProvider } from "@/contexts/sync-context";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: '400',
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drugucopia - Psychoactive Substances Documentation",
  description: "Documentation for psychoactive substances including effects, dosages, harm reduction.",
  keywords: ["psychoactive", "substances", "documentation", "harm reduction", "drug information"],
  authors: [{ name: "conflictmedia @ conflict@cocaine.ninja" }],
  icons: {
    icon: "logo.png",
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
        className={`${ibmPlexSans.className} ${ibmPlexMono.className} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Wrap app with SyncProvider */}
          <SyncProvider>
            {children}
            <Toaster />
          </SyncProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
