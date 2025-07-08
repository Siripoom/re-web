"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layout,
  Space,
  Button,
  Typography,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Avatar,
  Switch,
  Drawer,
  Grid,
} from "antd";
import {
  GlobalOutlined,
  LogoutOutlined,
  LoginOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

import { useLanguage } from "../contexts/LanguageContext";
import en from "../locales/en";
import th from "../locales/th";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import image from "../../../public/logo.png";

const { Header } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const translations = { en, th };

const Navbar: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [drawerVisible, setDrawerVisible] = useState(false);

  // ✅ ป้องกัน hydration mismatch
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return <Header style={{ height: 64, background: "#fff" }} />;

  const t = (key: keyof typeof en) => translations[language][key];

  const handleLanguageToggle = (checked: boolean) => {
    const newLang = checked ? "th" : "en";
    setLanguage(newLang);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userMenuItems: MenuProps["items"] = [
    { key: "login", icon: <LoginOutlined />, label: t("login") },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: t("logout"),
      danger: true,
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    console.log("Menu Clicked:", key);
  };

  const navigationLinks = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
      }}
    >
      <Link href="/home" style={{ color: "black", fontWeight: 500 }}>
        {t("home")}
      </Link>
      <Link href="/product" style={{ color: "black", fontWeight: 500 }}>
        {t("product")}
      </Link>
      <Link href="/aboutUs" style={{ color: "black", fontWeight: 500 }}>
        {t("aboutUs")}
      </Link>
      <Link href="/contactUs" style={{ color: "black", fontWeight: 500 }}>
        {t("contactUs")}
      </Link>
      <Space>
        <GlobalOutlined style={{ color: "#d4af37" }} />
        <Switch
          checkedChildren="TH"
          unCheckedChildren="EN"
          checked={language === "th"}
          onChange={handleLanguageToggle}
          style={{
            backgroundColor: language === "th" ? "#d4af37" : "#f0f0f0",
          }}
          className="gold-switch"
        />
      </Space>
    </div>
  );

  return (
    <>
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
        {/* Logo & Burger */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
            />
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src="/logo.png"
              alt="Logo"
              style={{
                width: "62px",
                height: "62px",
                objectFit: "contain",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <Text strong style={{ fontSize: "20px", color: "black" }}>
              Ruby&apos;s Real Estate
            </Text>
          </div>
        </div>

        {/* Main Menu */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link href="/home" style={{ color: "black", fontWeight: 500 }}>
              {t("home")}
            </Link>
            <Link href="/product" style={{ color: "black", fontWeight: 500 }}>
              {t("product")}
            </Link>
            <Link href="/aboutUs" style={{ color: "black", fontWeight: 500 }}>
              {t("aboutUs")}
            </Link>
            <Link href="/contactUs" style={{ color: "black", fontWeight: 500 }}>
              {t("contactUs")}
            </Link>

            <Space>
              <GlobalOutlined style={{ color: "#d4af37" }} />
              <Switch
                checkedChildren="TH"
                unCheckedChildren="EN"
                checked={language === "th"}
                onChange={handleLanguageToggle}
                style={{
                  backgroundColor: language === "th" ? "#d4af37" : "#f0f0f0",
                }}
                className="gold-switch"
              />
            </Space>
          </div>
        )}
      </Header>

      {/* Drawer (Mobile Menu) */}
      <Drawer
        title={t("menu")}
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {navigationLinks}
      </Drawer>

      <style jsx global>{`
        .gold-switch.ant-switch-checked {
          background-color: #d4af37 !important;
        }
        .gold-switch.ant-switch-checked:hover:not(.ant-switch-disabled) {
          background-color: #c9a227 !important;
        }
        .gold-switch.ant-switch:focus {
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
        }
      `}</style>
    </>
  );
};

export default Navbar;
