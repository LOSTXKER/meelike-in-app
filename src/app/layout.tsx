// src/app/layout.tsx

import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MeeLike Seller",
  description: "แพลตฟอร์มครบวงจรสำหรับธุรกิจ Social Media Engagement",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="light" style={{ colorScheme: 'light' }} suppressHydrationWarning>
      <body className={`${sarabun.className} bg-brand-bg dark:bg-dark-bg text-brand-text-dark dark:text-dark-text-dark transition-colors duration-300`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}