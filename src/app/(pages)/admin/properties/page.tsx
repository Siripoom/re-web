// src/app/(pages)/admin/properties/page.tsx
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
  Image,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { PropertyService } from "@/services/propertyService";
import type { Property } from "@/types/property";

const { Title } = Typography;
const { Search } = Input;

export default function AdminPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, selectedType, selectedLocation]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await PropertyService.getAllProperties();
      setProperties(data);
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = [...properties];

    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(
        (property) => property.property_type === selectedType
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(
        (property) => property.location === selectedLocation
      );
    }

    setFilteredProperties(filtered);
  };

  const handleDelete = async (id: string) => {
    try {
      await PropertyService.deleteProperty(id);
      message.success("ลบอสังหาสำเร็จ");
      fetchProperties();
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการลบ");
      console.error("Error deleting property:", error);
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      await PropertyService.updateProperty(id, { featured });
      message.success(
        featured ? "ตั้งเป็นอสังหาแนะนำแล้ว" : "ยกเลิกอสังหาแนะนำแล้ว"
      );
      fetchProperties();
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการอัปเดต");
      console.error("Error updating property:", error);
    }
  };

  const columns = [
    {
      title: "รูปภาพ",
      dataIndex: "images",
      key: "image",
      width: 80,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (images: any[]) => {
        const primaryImage =
          images?.find((img) => img.is_primary) || images?.[0];
        return (
          <Image
            width={60}
            height={45}
            src={primaryImage?.image_url || "/placeholder-property.jpg"}
            alt="Property"
            style={{ objectFit: "cover", borderRadius: "4px" }}
            fallback="/placeholder-property.jpg"
          />
        );
      },
    },
    {
      title: "ชื่ออสังหา",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Property) => (
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "4px" }}>{text}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.address.length > 50
              ? `${record.address.substring(0, 50)}...`
              : record.address}
          </div>
        </div>
      ),
    },
    {
      title: "ประเภท",
      dataIndex: "property_type",
      key: "property_type",
      width: 100,
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "รูปแบบอสังหา",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },

    {
      title: "ห้องนอน/ห้องน้ำ",
      key: "rooms",
      width: 130,
      render: (record: Property) => (
        <div style={{ fontSize: "12px" }}>
          <div>🛏️ {record.bedrooms} ห้องนอน</div>
          <div>🚿 {record.bathrooms} ห้องน้ำ</div>
        </div>
      ),
    },
    {
      title: "ราคา",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price: number) => (
        <div style={{ fontWeight: "bold", color: "#1890ff" }}>
          {price?.toLocaleString("th-TH")} บาท
        </div>
      ),
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => {
        const statusConfig = {
          Available: { color: "green", text: "พร้อมขาย" },
          Sold: { color: "red", text: "ขายแล้ว" },
          Rented: { color: "orange", text: "ให้เช่าแล้ว" },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || {
          color: "default",
          text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "แนะนำ",
      dataIndex: "featured",
      key: "featured",
      width: 80,
      render: (featured: boolean, record: Property) => (
        <Switch
          checked={featured}
          size="small"
          onChange={(checked) => handleToggleFeatured(record.id, checked)}
        />
      ),
    },
    {
      title: "การดำเนินการ",
      key: "action",
      width: 150,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: Property) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => router.push(`/property/${record.id}`)}
            title="ดู"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => router.push(`/admin/properties/edit/${record.id}`)}
            title="แก้ไข"
          />
          <Popconfirm
            title="ยืนยันการลบ"
            description="คุณแน่ใจหรือไม่ที่จะลบอสังหานี้?"
            onConfirm={() => handleDelete(record.id)}
            okText="ลบ"
            cancelText="ยกเลิก"
            okType="danger"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              danger
              title="ลบ"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
            จัดการอสังหาริมทรัพย์
          </Title>
          <div style={{ color: "#666", marginTop: "4px" }}>
            ทั้งหมด {filteredProperties.length} รายการ
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => router.push("/admin/properties/create")}
        >
          เพิ่มอสังหาใหม่
        </Button>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: "16px" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="ค้นหาชื่อหรือที่อยู่"
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="เลือกประเภทอสังหา"
              allowClear
              value={selectedType}
              onChange={setSelectedType}
              style={{ width: "100%" }}
            >
              {/* {PROPERTY_TYPES.map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))} */}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="เลือกสถานที่"
              allowClear
              value={selectedLocation}
              onChange={setSelectedLocation}
              style={{ width: "100%" }}
            >
              {/* {PROPERTY_LOCATIONS.map((location) => (
                <Select.Option key={location} value={location}>
                  {location}
                </Select.Option>
              ))} */}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Properties Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredProperties}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} จาก ${total} รายการ`,
          }}
          scroll={{ x: 1200 }}
          size="small"
        />
      </Card>
    </div>
  );
}
