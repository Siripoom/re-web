// src/app/(pages)/admin/users/create/page.tsx
"use client";
import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Switch,
  Button,
  Card,
  Row,
  Col,
  message,
  Typography,
  Space,
  Alert,
  Divider,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CrownOutlined,
  TeamOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/userService";
import { USER_ROLES } from "@/types/user";
import type { CreateUserRequest } from "@/types/user";

const { Title, Text } = Typography;

export default function CreateUserPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const handleSubmit = async (values: CreateUserRequest) => {
    try {
      setLoading(true);

      const usernameExists = await UserService.checkUsernameExists(values.username);
      if (usernameExists) {
        message.error("ชื่อผู้ใช้นี้มีอยู่แล้ว กรุณาเลือกชื่อผู้ใช้อื่น");
        return;
      }

      console.log("Submitting user data:", values);
      await UserService.createUser(values);
      
      message.success("เพิ่มผู้ใช้สำเร็จ");
      router.push("/admin/users");
    } catch (error: any) {
      console.error("Create user error:", error);
      message.error(error.message || "เกิดข้อผิดพลาดในการเพิ่มผู้ใช้");
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = async (username: string) => {
    if (!username || username.length < 3) return;

    try {
      setCheckingUsername(true);
      const exists = await UserService.checkUsernameExists(username);
      if (exists) {
        form.setFields([
          {
            name: "username",
            errors: ["ชื่อผู้ใช้นี้มีอยู่แล้ว"],
          },
        ]);
      }
    } catch (error) {
      console.error("Error checking username:", error);
    } finally {
      setCheckingUsername(false);
    }
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setFieldsValue({ password });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super_admin": return <CrownOutlined style={{ color: "#f5222d" }} />;
      case "admin": return <UserOutlined style={{ color: "#1890ff" }} />;
      case "editor": return <EditOutlined style={{ color: "#52c41a" }} />;
      default: return <UserOutlined />;
    }
  };

  return (
    <div style={{ padding: "0" }}>
      <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          ย้อนกลับ
        </Button>
        <div>
          <Title level={2} style={{ margin: 0 }}>เพิ่มผู้ใช้ใหม่</Title>
          <Text type="secondary">สร้างบัญชีผู้ใช้งานใหม่สำหรับระบบ</Text>
        </div>
      </div>

      <Alert
        message="ข้อมูลสำคัญ"
        description="ผู้ใช้จะได้รับชื่อผู้ใช้และรหัสผ่านเพื่อเข้าสู่ระบบ กรุณาแจ้งข้อมูลนี้ให้กับผู้ใช้อย่างปลอดภัย"
        type="info"
        showIcon
        style={{ marginBottom: "24px" }}
      />

      <Row gutter={[24, 0]}>
        <Col xs={24} lg={16}>
          <Card title="ข้อมูลผู้ใช้">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ role: "admin", is_active: true }}
            >
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="name"
                    label="ชื่อ-นามสกุล"
                    rules={[
                      { required: true, message: "กรุณาระบุชื่อ-นามสกุล" },
                      { min: 2, message: "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร" },
                    ]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="เช่น สมชาย ใจดี" size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="username"
                    label="ชื่อผู้ใช้"
                    rules={[
                      { required: true, message: "กรุณาระบุชื่อผู้ใช้" },
                      { min: 3, message: "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร" },
                      { pattern: /^[a-zA-Z0-9_]+$/, message: "ใช้ได้เฉพาะตัวอักษร ตัวเลข และ _" },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="เช่น admin01"
                      size="large"
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      suffix={checkingUsername ? <div className="animate-spin">⏳</div> : null}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    name="password"
                    label="รหัสผ่าน"
                    rules={[
                      { required: true, message: "กรุณาระบุรหัสผ่าน" },
                      { min: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="กรุณาระบุรหัสผ่าน"
                      size="large"
                      iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                      addonAfter={
                        <Button
                          type="link"
                          size="small"
                          onClick={generatePassword}
                          style={{ height: "100%", border: "none" }}
                        >
                          สุ่ม
                        </Button>
                      }
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    name="role"
                    label="บทบาท"
                    rules={[{ required: true, message: "กรุณาเลือกบทบาท" }]}
                  >
                    <Select size="large" placeholder="เลือกบทบาท">
                      {USER_ROLES.map((role) => (
                        <Select.Option key={role.value} value={role.value}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {getRoleIcon(role.value)}
                            <div>
                              <div style={{ fontWeight: "bold" }}>{role.label}</div>
                              <div style={{ fontSize: "11px", color: "#666" }}>{role.description}</div>
                            </div>
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item name="is_active" valuePropName="checked" label="สถานะการใช้งาน">
                    <Switch checkedChildren="เปิดใช้งาน" unCheckedChildren="ปิดใช้งาน" defaultChecked />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <div style={{ textAlign: "center" }}>
                <Space size="middle">
                  <Button size="large" onClick={() => router.back()}>ยกเลิก</Button>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                  >
                    เพิ่มผู้ใช้
                  </Button>
                </Space>
              </div>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Card title="ข้อมูลบทบาท" size="small">
              <div style={{ marginBottom: "16px" }}>
                <Title level={5} style={{ margin: "0 0 8px 0", color: "#f5222d" }}>
                  <CrownOutlined /> Super Admin
                </Title>
                <Text style={{ fontSize: "12px", color: "#666" }}>
                  สิทธิ์สูงสุด สามารถจัดการผู้ใช้ อสังหา และระบบทั้งหมด
                </Text>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <Title level={5} style={{ margin: "0 0 8px 0", color: "#1890ff" }}>
                  <UserOutlined /> Admin
                </Title>
                <Text style={{ fontSize: "12px", color: "#666" }}>
                  จัดการอสังหาริมทรัพย์ ดูรายงาน และสถิติ
                </Text>
              </div>

              <div>
                <Title level={5} style={{ margin: "0 0 8px 0", color: "#52c41a" }}>
                  <EditOutlined /> Editor
                </Title>
                <Text style={{ fontSize: "12px", color: "#666" }}>
                  แก้ไขข้อมูลอสังหา เพิ่มรูปภาพ และเนื้อหา
                </Text>
              </div>
            </Card>

            <Card title="คำแนะนำด้านความปลอดภัย" size="small">
              <div style={{ fontSize: "12px", lineHeight: "1.6" }}>
                <div style={{ marginBottom: "8px" }}>• ใช้รหัสผ่านที่แข็งแรง (อย่างน้อย 8 ตัวอักษร)</div>
                <div style={{ marginBottom: "8px" }}>• ผสมตัวอักษรใหญ่ เล็ก ตัวเลข และสัญลักษณ์</div>
                <div style={{ marginBottom: "8px" }}>• ไม่ใช้ข้อมูลส่วนตัวเป็นรหัสผ่าน</div>
                <div>• แจ้งให้ผู้ใช้เปลี่ยนรหัสผ่านในการเข้าใช้ครั้งแรก</div>
              </div>
            </Card>

            <Card title="สถิติผู้ใช้" size="small">
              <div style={{ textAlign: "center" }}>
                <div style={{ marginBottom: "8px" }}>
                  <TeamOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                </div>
                <Text style={{ fontSize: "12px", color: "#666" }}>
                  เมื่อเพิ่มผู้ใช้ใหม่เสร็จ จะมีผู้ใช้งานในระบบเพิ่มขึ้น
                </Text>
              </div>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
}