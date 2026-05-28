import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Gather - 소규모 이벤트 관리 플랫폼",
  description: "초대 링크 하나로 모든 것을 해결하는 일회성 이벤트 관리 플랫폼",
  openGraph: {
    type: "website",
    siteName: "Gather",
    title: "Gather - 소규모 이벤트 관리 플랫폼",
    description:
      "초대 링크 하나로 모든 것을 해결하는 일회성 이벤트 관리 플랫폼",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gather - 소규모 이벤트 관리 플랫폼",
    description:
      "초대 링크 하나로 모든 것을 해결하는 일회성 이벤트 관리 플랫폼",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
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
