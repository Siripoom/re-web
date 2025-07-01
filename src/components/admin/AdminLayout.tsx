// src/components/admin/AdminLayout.tsx
"use client";
import React, { useState } from "react";
import { Layout, ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import thTH from "antd/locale/th_TH";

const { Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <AntdRegistry>
      <ConfigProvider
        locale={thTH}
        theme={{
          token: {
            colorPrimary: "#1890ff",
            borderRadius: 6,
            colorBgContainer: "#ffffff",
          },
          components: {
            Layout: {
              bodyBg: "#f5f5f5",
              headerBg: "#ffffff",
              siderBg: "#001529",
            },
            Menu: {
              darkItemBg: "#001529",
              darkSubMenuItemBg: "#1f1f1f",
              darkItemSelectedBg: "#1890ff",
              darkItemHoverBg: "#1f1f1f",
            },
          },
        }}
      >
        <Layout style={{ minHeight: "100vh" }}>
          {/* Sidebar */}
          <AdminSidebar collapsed={collapsed} />

          {/* Main Content Area */}
          <Layout style={{ marginLeft: 0 }}>
            {/* Header */}
            <AdminHeader collapsed={collapsed} onToggle={toggleSidebar} />

            {/* Content */}
            <Content
              style={{
                margin: "24px",
                padding: "24px",
                minHeight: "calc(100vh - 112px)",
                background: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                overflow: "auto",
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </AntdRegistry>
  );
};

export default AdminLayout;
