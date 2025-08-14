"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "./์navbar/page";
import Footer from "./footer/page";
import { LanguageProvider } from './contexts/LanguageContext';
import { PropertyProvider } from "./contexts/PropertyContext";
import { Alert, notification } from "antd";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminRoute = pathname?.startsWith("/admin");
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    // Check if user is searching for "admin"
    const searchParams = new URLSearchParams(window.location.search);
    const searchQuery = searchParams.get('q') || '';
    
    if (searchQuery.toLowerCase().includes('admin')) {
      api.warning({
        message: 'กรุณาเข้าสู่ระบบ',
        description: 'คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถเข้าถึงส่วนนี้ได้',
        duration: 3,
      });
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }

    // Check admin route access
    if (isAdminRoute) {
      const user = sessionStorage.getItem("currentUser");
      if (!user) {
        setShowLoginAlert(true);
        api.warning({
          message: 'กรุณาเข้าสู่ระบบ',
          description: 'คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถเข้าถึงส่วน Admin ได้',
          duration: 1.5,
        });
        setTimeout(() => {
          router.replace("/login");
        }, 1500);
      }
    }
  }, [isAdminRoute, router, api]);

  if (isAdminRoute) {
    if (showLoginAlert) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffffff",
          }}
        >
          {contextHolder}
          <Alert
            message="กรุณาเข้าสู่ระบบ"
            description="คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถเข้าถึงส่วน Admin ได้"
            type="warning"
            showIcon
          />
        </div>
      );
    }
    return <>{children}</>;
  }

  return (
    <LanguageProvider>
      <PropertyProvider>
        {contextHolder}
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </PropertyProvider>
    </LanguageProvider>
  );
}