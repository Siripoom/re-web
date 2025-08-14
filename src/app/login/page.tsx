// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/userService";
import { Button, Form, Input, Card, Typography, Flex, Layout, theme, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { useToken } = theme;

export default function LoginPage() {
  const { token } = useToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    setError("");

    try {
      // Check if already logged in
      if (typeof window !== 'undefined' && sessionStorage.getItem("currentUser")) {
        router.push("/admin");
        return;
      }

      // Trim whitespace from inputs
      const credentials = {
        username: values.username.trim(),
        password: values.password.trim()
      };

      const response = await UserService.login(credentials);
      
      if (!response?.user) {
        throw new Error("Login failed - no user data returned");
      }

      // Store user in session storage
      sessionStorage.setItem("currentUser", JSON.stringify(response.user));
      
      router.push("/admin");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already logged in
  if (typeof window !== 'undefined') {
    const user = sessionStorage.getItem("currentUser");
    if (user) {
      router.push("/admin");
      return null;
    }
  }

  return (
    <Layout style={{ 
      minHeight: "100vh",
      background: token.colorBgContainer,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: token.paddingLG
    }}>
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          boxShadow: token.boxShadow,
          border: `1px solid ${token.colorBorderSecondary}`
        }}
        bodyStyle={{ padding: token.paddingLG }}
      >
        <div style={{ textAlign: "center", marginBottom: token.marginLG }}>
          <Title level={3} style={{ marginTop: token.margin }}>
            Sign In
          </Title>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: token.marginLG }}
          />
        )}

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="username"
            rules={[
              { 
                required: true, 
                message: 'Please input your username!' 
              },
              {
                min: 3,
                message: 'Username must be at least 3 characters!'
              }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Username" 
              size="large"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { 
                required: true, 
                message: 'Please input your password!' 
              },
              {
                min: 6,
                message: 'Password must be at least 6 characters!'
              }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
}