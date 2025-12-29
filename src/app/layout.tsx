// src/app/layout.tsx

import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import dynamic from 'next/dynamic';
import React from "react";

// Dynamic imports
const LayoutWrapper = dynamic(() => import("./components/LayoutWrapper"), { ssr: false });
const WelcomeSurveyModal = dynamic(() => import("./components/WelcomeSurveyModal"), { ssr: false });
const MockDataInitializer = dynamic(() => import("./components/MockDataInitializer"), { ssr: false });
const DailyLoginModal = dynamic(() => import("./components/DailyLoginModal"), { ssr: false });

const sarabun = Sarabun({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Meelike-TH Dashboard",
  description: "Dashboard for Meelike-TH services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="light" style={{ colorScheme: 'light' }} suppressHydrationWarning>
      <body className={`${sarabun.className} bg-brand-bg dark:bg-dark-bg text-brand-text-dark dark:text-dark-text-dark transition-colors duration-300`} suppressHydrationWarning>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <MockDataInitializer />
        <WelcomeSurveyModal />
        <DailyLoginModal />
      </body>
    </html>
  );
}
