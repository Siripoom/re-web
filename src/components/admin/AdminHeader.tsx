// src/components/admin/AdminHeader.tsx
"use client";
import React from "react";
import { Layout, Avatar, Dropdown, Space, Typography, Button } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Header } = Layout;
const { Text } = Typography;

interface AdminHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ collapsed, onToggle }) => {
  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "โปรไฟล์",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "ตั้งค่า",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "ออกจากระบบ",
      danger: true,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "logout":
        // Handle logout logic here
        console.log("Logout clicked");
        break;
      case "profile":
        // Handle profile navigation
        console.log("Profile clicked");
        break;
      case "settings":
        // Handle settings navigation
        console.log("Settings clicked");
        break;
      default:
        break;
    }
  };

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #f0f0f0",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Left Side */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          style={{
            fontSize: "16px",
            width: 40,
            height: 40,
          }}
        />
        <div>
          <Text strong style={{ fontSize: "18px", color: "#1890ff" }}>
             Ruby&apos;s Real Estate Phuket
          </Text>
          <Text
            type="secondary"
            style={{ fontSize: "12px", marginLeft: "8px" }}
          >
            Admin Panel
          </Text>
        </div>
      </div>

      {/* Right Side */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Notifications */}
        <Button
          type="text"
          icon={<BellOutlined />}
          style={{
            fontSize: "16px",
            width: 40,
            height: 40,
          }}
        />

        {/* User Menu */}
        <Dropdown
          menu={{ items: userMenuItems, onClick: handleMenuClick }}
          placement="bottomRight"
          arrow={{ pointAtCenter: true }}
        >
          <Space
            style={{
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "6px",
            }}
          >
            <Avatar
              size="small"
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1890ff" }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Text strong style={{ fontSize: "14px", lineHeight: 1 }}>
                Admin User
              </Text>
              <Text
                type="secondary"
                style={{ fontSize: "12px", lineHeight: 1 }}
              >
                ผู้ดูแลระบบ
              </Text>
            </div>
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AdminHeader;
