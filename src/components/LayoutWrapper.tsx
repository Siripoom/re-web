// src/components/LayoutWrapper.tsx
"use client";
import { usePathname } from "next/navigation";
import Navbar from "./์navbar/page";
import Footer from "./footer/page";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // Admin routes don't use the main navbar/footer
    return <>{children}</>;
  }

  // Regular pages use navbar and footer
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
