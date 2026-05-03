import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { ThemeToggle } from "./ThemeToggle";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Conemo | Anonymous Mood Chat",
  description: "Connect instantly with strangers based on your current mood. A secure, real-time anonymous chat platform to express yourself freely.",
  keywords: "anonymous chat, mood chat, stranger chat, online chat, free chat, connect, talk to strangers, real-time chat",
  authors: [{ name: "Conemo" }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: "Conemo | Anonymous Mood Chat",
    description: "Connect instantly with strangers based on your current mood.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#09090b", // zinc-950
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-white transition-colors duration-500`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <div className="bg-orbs"></div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
