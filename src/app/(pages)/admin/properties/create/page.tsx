// src/app/(pages)/admin/properties/create/page.tsx
"use client";
import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Card,
  Row,
  Col,
  message,
  Typography,
  Upload,
  Space,
} from "antd";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { PropertyService } from "@/services/propertyService";

import type { UploadFile } from "antd/es/upload/interface";

const { Title } = Typography;
const { TextArea } = Input;

interface PropertyFormData {
  name: string;
  address: string;
  description?: string;
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
  living_rooms: number;
  car_parks: number;
  price: number;
  property_type: string;
  location?: string;
  area_sqm?: number;
  land_area_sqm?: number;
  status: string;
  featured: boolean;
  type: string;
}

export default function CreatePropertyPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([]);

  const handleSubmit = async (values: PropertyFormData) => {
    try {
      setLoading(true);

      // Create property first
      const newProperty = await PropertyService.createProperty(values);

      // Upload images if any
      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          if (file.originFileObj) {
            try {
              const imageUrl = await PropertyService.uploadImage(
                file.originFileObj,
                newProperty.id
              );

              await PropertyService.addPropertyImage(
                newProperty.id,
                imageUrl,
                `properties/${newProperty.id}/${file.name}`,
                file.name,
                i === 0, // First image is primary
                i
              );
            } catch (imageError) {
              console.error("Error uploading image:", imageError);
              message.warning(`ไม่สามารถอัปโหลดรูปภาพ ${file.name} ได้`);
            }
          }
        }
      }

      message.success("เพิ่มอสังหาริมทรัพย์สำเร็จ");
      router.push("/admin/properties");
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการเพิ่มอสังหา");
      console.error("Error creating property:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setImageFiles(fileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>อัปโหลด</div>
    </div>
  );

  return (
    <div style={{ padding: "0" }}>
      {/* Page Header */}
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          ย้อนกลับ
        </Button>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            เพิ่มอสังหาริมทรัพย์ใหม่
          </Title>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          bedrooms: 1,
          bathrooms: 1,
          kitchens: 1,
          living_rooms: 1,
          car_parks: 1,
          status: "Available",
          featured: false,
          type: "sell",
        }}
      >
        <Row gutter={[24, 0]}>
          {/* Left Column - Basic Information */}
          <Col xs={24} lg={14}>
            <Card title="ข้อมูลพื้นฐาน" style={{ marginBottom: "16px" }}>
              <Row gutter={[16, 0]}>
                <Col span={24}>
                  <Form.Item
                    name="name"
                    label="ชื่ออสังหาริมทรัพย์"
                    rules={[{ required: true, message: "กรุณาระบุชื่ออสังหา" }]}
                  >
                    <Input placeholder="เช่น Luxury Villa in Kamala" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    name="location"
                    label="พื้นที่ตั้ง"
                    rules={[{ required: true, message: "กรุณาระบุพื้นที่ตั้ง" }]}
                  >
                    <Select placeholder="เลือกพื้นที่ตั้ง">
                      <Select.Option value="Patong">ป่าตอง</Select.Option>
                      <Select.Option value="Kamala">กะมะลา</Select.Option>
                      <Select.Option value="Kata">กะตะ</Select.Option>
                      <Select.Option value="Karon">กะรน</Select.Option>
                      <Select.Option value="Rawai">ราไวย์</Select.Option>
                      <Select.Option value="Phuket Town">เมืองภูเก็ต</Select.Option>
                      <Select.Option value="Cherngtalay">เชิงทะเล</Select.Option>
                      <Select.Option value="Bang Tao">บางเทา</Select.Option>
                      <Select.Option value="Nai Harn">ในหาน</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    name="address"
                    label="ที่อยู่"
                    rules={[{ required: true, message: "กรุณาระบุที่อยู่" }]}
                  >
                    <TextArea
                      rows={3}
                      placeholder="ที่อยู่เต็มของอสังหาริมทรัพย์"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="description" label="รายละเอียด">
                    <TextArea
                      rows={4}
                      placeholder="รายละเอียดของอสังหาริมทรัพย์"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="property_type"
                    label="ประเภทอสังหา"
                    rules={[{ required: true, message: "กรุณาเลือกประเภท" }]}
                  >
                    <Select placeholder="เลือกประเภท">
                      <Select.Option value="Villa">วิลล่า</Select.Option>
                      <Select.Option value="Condo">คอนโดมิเนียม</Select.Option>
                      <Select.Option value="House">บ้านเดี่ยว</Select.Option>
                      <Select.Option value="Apartment">
                        อพาร์ตเมนต์
                      </Select.Option>
                      <Select.Option value="Penthouse">
                        เพนท์เฮาส์
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}></Col>
              </Row>
            </Card>

            {/* Room Details */}
            <Card title="จำนวนห้อง" style={{ marginBottom: "16px" }}>
              <Row gutter={[16, 0]}>
                <Col xs={12} sm={8}>
                  <Form.Item
                    name="bedrooms"
                    label="ห้องนอน"
                    rules={[{ required: true, message: "กรุณาระบุจำนวน" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col xs={12} sm={8}>
                  <Form.Item
                    name="bathrooms"
                    label="ห้องน้ำ"
                    rules={[{ required: true, message: "กรุณาระบุจำนวน" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col xs={12} sm={8}>
                  <Form.Item name="kitchens" label="ห้องครัว">
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col xs={12} sm={8}>
                  <Form.Item name="living_rooms" label="ห้องนั่งเล่น">
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col xs={12} sm={8}>
                  <Form.Item name="car_parks" label="ที่จอดรถ">
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Area Information */}
            <Card title="ข้อมูลพื้นที่" style={{ marginBottom: "16px" }}>
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item name="area_sqm" label="พื้นที่ใช้สอย (ตร.ม.)">
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="0"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item name="land_area_sqm" label="พื้นที่ดิน (ตร.ม.)">
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="0"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Column - Price & Settings */}
          <Col xs={24} lg={10}>
            <Card title="ราคาและการตั้งค่า" style={{ marginBottom: "16px" }}>
              <Form.Item
                name="price"
                label="ราคา (บาท)"
                rules={[{ required: true, message: "กรุณาระบุราคา" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  placeholder="0"
                />
              </Form.Item>

              <Form.Item
                name="status"
                label="สถานะ"
                rules={[{ required: true, message: "กรุณาเลือกสถานะ" }]}
              >
                <Select>
                  <Select.Option value="Available">พร้อมขาย</Select.Option>
                  <Select.Option value="Sold">ขายแล้ว</Select.Option>
                  <Select.Option value="Rented">ให้เช่าแล้ว</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="type"
                label="ประเภทการประกาศ"
                rules={[{ required: true, message: "กรุณาเลือกประเภท" }]}
              >
                <Select>
                  <Select.Option value="sell">ขาย</Select.Option>
                  <Select.Option value="rent">ให้เช่า</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="featured" valuePropName="checked">
                <Space>
                  <Switch />
                  <span>แสดงในหน้าแรก</span>
                </Space>
              </Form.Item>
            </Card>

            {/* Images */}
            <Card title="รูปภาพ">
              <Upload
                listType="picture-card"
                fileList={imageFiles}
                onChange={handleImageChange}
                beforeUpload={() => false} // Prevent auto upload
                multiple
              >
                {imageFiles.length >= 8 ? null : uploadButton}
              </Upload>
              <div
                style={{ marginTop: "8px", color: "#666", fontSize: "12px" }}
              >
                รองรับไฟล์: JPG, PNG, WEBP (สูงสุด 8 รูป)
              </div>
            </Card>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Card style={{ marginTop: "16px", textAlign: "center" }}>
          <Space size="middle">
            <Button size="large" onClick={() => router.back()}>
              ยกเลิก
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
              icon={<PlusOutlined />}
            >
              เพิ่มอสังหาริมทรัพย์
            </Button>
          </Space>
        </Card>
      </Form>
    </div>
  );
} 