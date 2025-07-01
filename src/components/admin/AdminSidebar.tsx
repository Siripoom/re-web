// src/components/admin/AdminSidebar.tsx
"use client";
import React from "react";
import { Layout, Menu, Typography } from "antd";
import {
  DashboardOutlined,
  HomeOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import type { MenuProps } from "antd";

const { Sider } = Layout;
const { Text } = Typography;

interface AdminSidebarProps {
  collapsed: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Menu items configuration
  const menuItems: MenuProps["items"] = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: "แดชบอร์ด",
    },
    {
      key: "properties",
      icon: <HomeOutlined />,
      label: "จัดการอสังหาริมทรัพย์",
      children: [
        {
          key: "/admin/properties",
          icon: <HomeOutlined />,
          label: "รายการทั้งหมด",
        },
        {
          key: "/admin/properties/create",
          icon: <PlusOutlined />,
          label: "เพิ่มอสังหาใหม่",
        },
      ],
    },

    {
      key: "users",
      icon: <UserOutlined />,
      label: "จัดการผู้ใช้",
      children: [
        {
          key: "/admin/users",
          icon: <UserOutlined />,
          label: "รายการผู้ใช้",
        },
        {
          key: "/admin/users/create",
          icon: <PlusOutlined />,
          label: "เพิ่มผู้ใช้ใหม่",
        },
      ],
    },
  ];

  // Handle menu click
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key.startsWith("/")) {
      router.push(key);
    }
  };

  // Get selected keys based on current pathname
  const getSelectedKeys = () => {
    if (pathname === "/admin") return ["/admin"];
    if (pathname.startsWith("/admin/properties")) {
      if (pathname === "/admin/properties/create")
        return ["/admin/properties/create"];
      if (pathname === "/admin/properties/categories")
        return ["/admin/properties/categories"];
      return ["/admin/properties"];
    }
    if (pathname.startsWith("/admin/media")) return ["/admin/media/images"];
    if (pathname.startsWith("/admin/analytics")) return ["/admin/analytics"];
    if (pathname.startsWith("/admin/users")) {
      if (pathname === "/admin/users/roles") return ["/admin/users/roles"];
      return ["/admin/users"];
    }
    if (pathname.startsWith("/admin/settings")) return ["/admin/settings"];
    return [];
  };

  // Get open keys for submenus
  const getOpenKeys = () => {
    if (pathname.startsWith("/admin/properties")) return ["properties"];
    if (pathname.startsWith("/admin/media")) return ["media"];
    if (pathname.startsWith("/admin/users")) return ["users"];
    return [];
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
        background: "#001529",
      }}
      width={250}
      collapsedWidth={80}
    >
      {/* Logo */}
      <div
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? "0" : "0 24px",
          borderBottom: "1px solid #1f1f1f",
        }}
      >
        {collapsed ? (
          <Text
            style={{
              color: "#1890ff",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            R
          </Text>
        ) : (
          <Text
            style={{
              color: "#1890ff",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Ruby Admin
          </Text>
        )}
      </div>

      {/* Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          borderRight: 0,
          marginTop: "16px",
        }}
      />
    </Sider>
  );
};

export default AdminSidebar;
