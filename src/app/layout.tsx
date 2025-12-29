// src/app/layout.tsx

import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar"; // Path should be correct now
import Header from "./components/Header";   // Path should be correct now
import dynamic from 'next/dynamic';

const WelcomeSurveyModal = dynamic(() => import("./components/WelcomeSurveyModal"), { ssr: false });
import React from "react"; // Import React

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

// This is the fix for the children prop type error
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="light" style={{ colorScheme: 'light' }} suppressHydrationWarning>
      <body className={`${sarabun.className} bg-brand-bg dark:bg-dark-bg text-brand-text-dark dark:text-dark-text-dark transition-colors duration-300`} suppressHydrationWarning>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <div className="flex-1 overflow-y-auto">{children}</div>
          </div>
        </div>
        <MockDataInitializer />
        <WelcomeSurveyModal />
        <DailyLoginModal />
      </body>
    </html>
  );
}