"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Layout, Space, Button, Typography, Switch, Drawer, Grid } from "antd";
import { GlobalOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";

import { useLanguage } from "../contexts/LanguageContext";
import en from "../locales/en";
import th from "../locales/th";

const { Header } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const translations = { en, th };

const Navbar: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [drawerVisible, setDrawerVisible] = useState(false);

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

  const navigationLinks = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        padding: "24px",
        backgroundColor: "#721716",
        height: "100%",
        color: "white",
      }}
    >
      <Link href="/home" style={{ color: "white", fontWeight: 600, fontSize: "20px" }}>
        {t("home")}
      </Link>
      <Link href="/product" style={{ color: "white", fontWeight: 600, fontSize: "20px" }}>
        {t("product")}
      </Link>
      <Link href="/aboutUs" style={{ color: "white", fontWeight: 600, fontSize: "20px" }}>
        {t("aboutUs")}
      </Link>
      <Link href="/contactUs" style={{ color: "white", fontWeight: 600, fontSize: "20px" }}>
        {t("contactUs")}
      </Link>
      <Space>
        <GlobalOutlined style={{ color: "white", fontSize: "20px" }} />
        <Switch
          checkedChildren={<span style={{ color: "white", fontSize: "16px", fontWeight: 600 }}>TH</span>}
          unCheckedChildren={<span style={{ color: "black", fontSize: "16px", fontWeight: 600 }}>EN</span>}
          checked={language === "th"}
          onChange={handleLanguageToggle}
          style={{
            backgroundColor: language === "th" ? "#d4af37" : "#f0f0f0",
            height: "32px",
            width: "80px",
            minWidth: "80px",
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
          background: "#721716",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          height: "80px",
        }}
      >
        {/* Logo & Burger */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined className="hamburger-icon" />}
              onClick={() => setDrawerVisible(true)}
              className="hamburger-button"
            />
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src="/logo2-remove-bg.png"
              alt="Logo"
              style={{
                width: "80px",
                height: "90px",
                objectFit: "contain",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <Text strong style={{ fontSize: "24px", color: "white" }}>
              Ruby&apos;s Real Estate
            </Text>
          </div>
        </div>

        {/* Main Menu */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <Link href="/home" style={{ color: "white", fontWeight: 600, fontSize: "18px" }}>
              {t("home")}
            </Link>
            <Link href="/product" style={{ color: "white", fontWeight: 600, fontSize: "18px" }}>
              {t("product")}
            </Link>
            <Link href="/aboutUs" style={{ color: "white", fontWeight: 600, fontSize: "18px" }}>
              {t("aboutUs")}
            </Link>
            <Link href="/contactUs" style={{ color: "white", fontWeight: 600, fontSize: "18px" }}>
              {t("contactUs")}
            </Link>
            <Space>
              <GlobalOutlined style={{ color: "white", fontSize: "20px" }} />
              <Switch
                checkedChildren={
                  <span style={{ color: "white", fontSize: "16px", fontWeight: 600 }}>
                    TH
                  </span>
                }
                unCheckedChildren={
                  <span style={{ color: "black", fontSize: "16px", fontWeight: 600 }}>
                    EN
                  </span>
                }
                checked={language === "th"}
                onChange={handleLanguageToggle}
                style={{
                  backgroundColor: language === "th" ? "#d4af37" : "#f0f0f0",
                  height: "32px",
                  width: "80px",
                  minWidth: "80px",
                }}
                className="gold-switch"
              />
            </Space>
          </div>
        )}
      </Header>

      {/* Drawer (Mobile Menu) */}
      <Drawer
        title={<span style={{ color: "white", fontSize: "20px", fontWeight: 600 }}>{t("menu")}</span>}
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        styles={{
          content: {
            backgroundColor: "#721716",
          },
          header: {
            backgroundColor: "#721716",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
        closeIcon={<CloseOutlined className="drawer-close-icon" />}
      >
        {navigationLinks}
      </Drawer>

      <style jsx global>{`
        .gold-switch.ant-switch .ant-switch-inner {
          color: black !important;
          font-weight: 600;
        }

        .gold-switch.ant-switch .ant-switch-handle {
          top: 6px;
        }
        
        .gold-switch .ant-switch-inner {
          padding-top: 4px;
        }

        .gold-switch.ant-switch-checked .ant-switch-inner {
          color: white !important;
          font-weight: 600;
        }

        .gold-switch.ant-switch-checked {
          background-color: #d4af37 !important;
        }

        .gold-switch.ant-switch-checked:hover:not(.ant-switch-disabled) {
          background-color: #c9a227 !important;
        }

        .gold-switch.ant-switch:focus {
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
        }

        /* Hamburger menu styles */
        .hamburger-icon {
          font-size: 28px;
          color: white !important;
        }

        .hamburger-button {
          color: white !important;
          font-size: 28px;
          width: 48px;
          height: 48px;
        }

        .hamburger-button:hover {
          color: white !important;
          background-color: rgba(255, 255, 255, 0.1) !important;
        }

        /* Drawer close icon styles */
        .drawer-close-icon {
          font-size: 28px !important;
          color: white !important;
        }

        .drawer-close-icon:hover {
          color: white !important;
          opacity: 0.8;
        }
      `}</style>
    </>
  );
};

export default Navbar;