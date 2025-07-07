"use client";
import { usePathname } from "next/navigation";
import Navbar from "./์navbar/page";
import Footer from "./footer/page";
import { LanguageProvider, } from './contexts/LanguageContext';
import { PropertyProvider } from "./contexts/PropertyContext";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <LanguageProvider>
      <PropertyProvider>
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </PropertyProvider>
    </LanguageProvider>
  );
}
