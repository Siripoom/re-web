// src/app/(pages)/admin/users/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Input,
  Select,
  Row,
  Col,
  Card,
  Typography,
  Avatar,
  Switch,
  Modal,
  Badge,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  UserOutlined,
  LockOutlined,
  UnlockOutlined,
  CrownOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/userService";
import type { User } from "@/types/user";
import {
  USER_ROLES,
  getRoleLabel,
  getRoleColor,
  getStatusLabel,
  getStatusColor,
} from "@/types/user";

const { Title, Text } = Typography;
const { Search } = Input;

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await UserService.getAllUsers();
      setUsers(data);
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole) {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }

    if (selectedStatus !== undefined) {
      filtered = filtered.filter((user) => user.is_active === selectedStatus);
    }

    setFilteredUsers(filtered);
  };

  const handleDelete = async (id: string, username: string) => {
    try {
      await UserService.deleteUser(id);
      message.success(`ลบผู้ใช้ ${username} สำเร็จ`);
      fetchUsers();
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการลบผู้ใช้");
      console.error("Error deleting user:", error);
    }
  };

  const handleToggleStatus = async (
    id: string,
    currentStatus: boolean,
    username: string
  ) => {
    try {
      await UserService.toggleUserStatus(id, !currentStatus);
      message.success(
        `${
          !currentStatus ? "เปิดใช้งาน" : "ปิดใช้งาน"
        }ผู้ใช้ ${username} สำเร็จ`
      );
      fetchUsers();
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการเปลี่ยนสถานะผู้ใช้");
      console.error("Error toggling user status:", error);
    }
  };

  const handleResetPassword = async (id: string, username: string) => {
    Modal.confirm({
      title: "รีเซ็ตรหัสผ่าน",
      content: `คุณต้องการรีเซ็ตรหัสผ่านของ ${username} เป็น "password123" หรือไม่?`,
      okText: "รีเซ็ต",
      cancelText: "ยกเลิก",
      okType: "danger",
      onOk: async () => {
        try {
          await UserService.resetPassword(id, "password123");
          message.success(`รีเซ็ตรหัสผ่านของ ${username} สำเร็จ`);
        } catch (error) {
          message.error("เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน");
          console.error("Error resetting password:", error);
        }
      },
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super_admin":
        return <CrownOutlined style={{ color: "#f5222d" }} />;
      case "admin":
        return <UserOutlined style={{ color: "#1890ff" }} />;
      case "editor":
        return <EditOutlined style={{ color: "#52c41a" }} />;
      default:
        return <UserOutlined />;
    }
  };

  const columns = [
    {
      title: "ผู้ใช้",
      key: "user",
      width: 250,
      render: (record: User) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{
              backgroundColor: record.is_active ? "#1890ff" : "#d9d9d9",
              color: record.is_active ? "white" : "#999",
            }}
          >
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: "bold", fontSize: "14px" }}>
              {record.name}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              @{record.username}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "บทบาท",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: string) => (
        <Space>
          {getRoleIcon(role)}
          <Tag color={getRoleColor(role)} style={{ fontSize: "11px" }}>
            {getRoleLabel(role)}
          </Tag>
        </Space>
      ),
    },
    {
      title: "สถานะ",
      dataIndex: "is_active",
      key: "is_active",
      width: 100,
      render: (isActive: boolean, record: User) => (
        <Switch
          checked={isActive}
          size="small"
          checkedChildren="เปิด"
          unCheckedChildren="ปิด"
          onChange={() =>
            handleToggleStatus(record.id, isActive, record.username)
          }
        />
      ),
    },
    {
      title: "เข้าสู่ระบบล่าสุด",
      dataIndex: "last_login",
      key: "last_login",
      width: 150,
      render: (lastLogin: string) => {
        if (!lastLogin) {
          return (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              ยังไม่เคยเข้าใช้
            </Text>
          );
        }

        const date = new Date(lastLogin);
        const now = new Date();
        const diffInDays = Math.floor(
          (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );

        let color = "#52c41a"; // เขียว
        if (diffInDays > 7) color = "#faad14"; // เหลือง
        if (diffInDays > 30) color = "#f5222d"; // แดง

        return (
          <div>
            <div style={{ fontSize: "12px", color }}>
              {diffInDays === 0 ? "วันนี้" : `${diffInDays} วันที่แล้ว`}
            </div>
            <div style={{ fontSize: "11px", color: "#999" }}>
              {date.toLocaleDateString("th-TH")}
            </div>
          </div>
        );
      },
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      render: (createdAt: string) => (
        <Text style={{ fontSize: "12px" }}>
          {new Date(createdAt).toLocaleDateString("th-TH")}
        </Text>
      ),
    },
    {
      title: "การดำเนินการ",
      key: "action",
      width: 180,
      render: (_: any, record: User) => (
        <Space size="small">
          <Tooltip title="ดูข้อมูล">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => router.push(`/admin/users/view/${record.id}`)}
            />
          </Tooltip>

          <Tooltip title="แก้ไข">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => router.push(`/admin/users/edit/${record.id}`)}
            />
          </Tooltip>

          <Tooltip title="รีเซ็ตรหัสผ่าน">
            <Button
              type="text"
              icon={<LockOutlined />}
              size="small"
              onClick={() => handleResetPassword(record.id, record.username)}
            />
          </Tooltip>

          <Popconfirm
            title="ยืนยันการลบ"
            description={`คุณแน่ใจหรือไม่ที่จะลบผู้ใช้ ${record.username}?`}
            onConfirm={() => handleDelete(record.id, record.username)}
            okText="ลบ"
            cancelText="ยกเลิก"
            okType="danger"
          >
            <Tooltip title="ลบ">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const activeUsers = users.filter((u) => u.is_active).length;
  const inactiveUsers = users.length - activeUsers;
  const superAdmins = users.filter((u) => u.role === "super_admin").length;
  const admins = users.filter((u) => u.role === "admin").length;
  const editors = users.filter((u) => u.role === "editor").length;

  return (
    <div style={{ padding: "0" }}>
      {/* Page Header */}
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            จัดการผู้ใช้งาน
          </Title>
          <div style={{ color: "#666", marginTop: "4px" }}>
            ทั้งหมด {filteredUsers.length} คน
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => router.push("/admin/users/create")}
        >
          เพิ่มผู้ใช้ใหม่
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Avatar
                size={40}
                icon={<TeamOutlined />}
                style={{ backgroundColor: "#1890ff" }}
              />
              <div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#1890ff",
                  }}
                >
                  {users.length}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  ผู้ใช้ทั้งหมด
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Avatar
                size={40}
                icon={<UnlockOutlined />}
                style={{ backgroundColor: "#52c41a" }}
              />
              <div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#52c41a",
                  }}
                >
                  {activeUsers}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  ใช้งานอยู่
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Avatar
                size={40}
                icon={<LockOutlined />}
                style={{ backgroundColor: "#fa541c" }}
              />
              <div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#fa541c",
                  }}
                >
                  {inactiveUsers}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>ปิดใช้งาน</div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Avatar
                size={40}
                icon={<CrownOutlined />}
                style={{ backgroundColor: "#722ed1" }}
              />
              <div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#722ed1",
                  }}
                >
                  {superAdmins + admins}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  ผู้ดูแลระบบ
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: "16px" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="ค้นหาชื่อผู้ใช้หรือชื่อจริง"
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="เลือกบทบาท"
              allowClear
              value={selectedRole}
              onChange={setSelectedRole}
              style={{ width: "100%" }}
            >
              {USER_ROLES.map((role) => (
                <Select.Option key={role.value} value={role.value}>
                  <Space>
                    {getRoleIcon(role.value)}
                    {role.label}
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="เลือกสถานะ"
              allowClear
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ width: "100%" }}
            >
              <Select.Option value={true}>
                <Space>
                  <UnlockOutlined style={{ color: "#52c41a" }} />
                  ใช้งานอยู่
                </Space>
              </Select.Option>
              <Select.Option value={false}>
                <Space>
                  <LockOutlined style={{ color: "#fa541c" }} />
                  ปิดใช้งาน
                </Space>
              </Select.Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Role Distribution */}
      <Card style={{ marginBottom: "16px" }}>
        <Title level={5} style={{ marginBottom: "16px" }}>
          <TeamOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
          การกระจายบทบาท
        </Title>
        <Row gutter={[16, 8]}>
          <Col span={8}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Badge color="#f5222d" />
              <Text style={{ fontSize: "13px" }}>
                Super Admin: {superAdmins} คน
              </Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Badge color="#1890ff" />
              <Text style={{ fontSize: "13px" }}>Admin: {admins} คน</Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Badge color="#52c41a" />
              <Text style={{ fontSize: "13px" }}>Editor: {editors} คน</Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} จาก ${total} คน`,
          }}
          scroll={{ x: 1000 }}
          size="small"
          locale={{
            emptyText: "ไม่มีข้อมูลผู้ใช้",
          }}
          rowClassName={(record) =>
            record.is_active ? "" : "ant-table-row-disabled"
          }
        />
      </Card>

      <style jsx global>{`
        .ant-table-row-disabled {
          background-color: #fafafa !important;
          opacity: 0.6;
        }
        .ant-table-row-disabled:hover {
          background-color: #f5f5f5 !important;
        }
      `}</style>
    </div>
  );
}
