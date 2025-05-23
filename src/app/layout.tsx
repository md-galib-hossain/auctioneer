import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/Header/header";
import { cookies } from "next/headers";
import { SocketProvider } from "@/lib/socket";
import { Providers } from "@/lib/providers/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    // Access token from cookies (adjust based on your auth system)
    const cookieStore = cookies();
    const token = (await cookieStore).get("better-auth.session_token")?.value; 
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {" "}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SocketProvider token={token}>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <div className="flex-1">
                <Providers>{children}</Providers></div>
            </div>
          </SocketProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
