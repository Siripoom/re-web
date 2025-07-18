// src/app/(pages)/admin/properties/edit/[id]/page.tsx
"use client";
import React, { useState, useEffect } from "react";
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
  Image,
  Space,
  Popconfirm,
  Spin,
} from "antd";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import { PropertyService } from "@/services/propertyService";

import type { Property, PropertyImage } from "@/types/property";
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

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [property, setProperty] = useState<Property | null>(null);
  const [existingImages, setExistingImages] = useState<PropertyImage[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      setPageLoading(true);
      const data = await PropertyService.getPropertyById(propertyId);
      if (data) {
        setProperty(data);
        setExistingImages(data.images || []);

        // Set form values
        form.setFieldsValue({
          name: data.name,
          address: data.address,
          description: data.description,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          kitchens: data.kitchens,
          living_rooms: data.living_rooms,
          car_parks: data.car_parks,
          price: data.price,
          property_type: data.property_type,
          location: data.location,
          area_sqm: data.area_sqm,
          land_area_sqm: data.land_area_sqm,
          status: data.status,
          featured: data.featured,
          type: data.type,
          contact: data.contact,
        });
      } else {
        message.error("ไม่พบข้อมูลอสังหาริมทรัพย์");
        router.push("/admin/properties");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      console.error("Error fetching property:", error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubmit = async (values: PropertyFormData) => {
    try {
      setLoading(true);

      // Update property data
      await PropertyService.updateProperty(propertyId, values);

      // Upload new images if any
      if (newImageFiles.length > 0) {
        for (let i = 0; i < newImageFiles.length; i++) {
          const file = newImageFiles[i];
          if (file.originFileObj) {
            try {
              const imageUrl = await PropertyService.uploadImage(
                file.originFileObj,
                propertyId
              );

              await PropertyService.addPropertyImage(
                propertyId,
                imageUrl,
                `properties/${propertyId}/${file.name}`,
                file.name,
                existingImages.length === 0 && i === 0, // Primary if no existing images
                existingImages.length + i
              );
            } catch (imageError) {
              console.error("Error uploading image:", imageError);
              message.warning(`ไม่สามารถอัปโหลดรูปภาพ ${file.name} ได้`);
            }
          }
        }
      }

      message.success("อัปเดตอสังหาริมทรัพย์สำเร็จ");
      router.push("/admin/properties");
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการอัปเดต");
      console.error("Error updating property:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await PropertyService.deletePropertyImage(imageId);
      setExistingImages(existingImages.filter((img) => img.id !== imageId));
      message.success("ลบรูปภาพสำเร็จ");
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการลบรูปภาพ");
      console.error("Error deleting image:", error);
    }
  };

  const handleSetPrimaryImage = async (imageId: string) => {
    try {
      await PropertyService.setPrimaryImage(imageId, propertyId);
      setExistingImages(
        existingImages.map((img) => ({
          ...img,
          is_primary: img.id === imageId,
        }))
      );
      message.success("ตั้งเป็นรูปหลักสำเร็จ");
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการตั้งรูปหลัก");
      console.error("Error setting primary image:", error);
    }
  };

  const handleNewImageChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setNewImageFiles(fileList);
  };

  if (pageLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!property) {
    return null;
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>เพิ่มรูป</div>
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
            แก้ไขอสังหาริมทรัพย์
          </Title>
          <p style={{ color: "#666", margin: "4px 0 0 0" }}>{property.name}</p>
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
                      <Select.Option value="Land">
                        ที่ดิน
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    name="contact"
                    label="ช่องทางการติดต่อ"
                    rules={[{ required: true, message: "กรุณาระบุช่องทางการติดต่อ" }]}
                  >
                    <Input
                      placeholder="เช่น เบอร์โทรศัพท์, อีเมล หรือ LINE ID"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="location"
                    label="พื้นที่"
                    rules={[{ required: true, message: "กรุณาเลือกพื้นที่" }]}
                  >
                    <Select placeholder="เลือกพื้นที่">
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

          {/* Right Column - Price & Settings & Images */}
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

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <Card title="รูปภาพปัจจุบัน" style={{ marginBottom: "16px" }}>
                <Row gutter={[8, 8]}>
                  {existingImages.map((image) => (
                    <Col xs={12} key={image.id}>
                      <div style={{ position: "relative" }}>
                        <Image
                          width="100%"
                          height={120}
                          src={image.image_url}
                          alt={image.alt_text}
                          style={{ objectFit: "cover", borderRadius: "6px" }}
                        />

                        {/* Primary badge */}
                        {image.is_primary && (
                          <div
                            style={{
                              position: "absolute",
                              top: "4px",
                              left: "4px",
                              background: "#52c41a",
                              color: "white",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            หลัก
                          </div>
                        )}

                        {/* Action buttons */}
                        <div
                          style={{
                            position: "absolute",
                            top: "4px",
                            right: "4px",
                            display: "flex",
                            gap: "4px",
                          }}
                        >
                          <Button
                            size="small"
                            type={image.is_primary ? "primary" : "default"}
                            icon={
                              image.is_primary ? (
                                <StarFilled />
                              ) : (
                                <StarOutlined />
                              )
                            }
                            onClick={() => handleSetPrimaryImage(image.id)}
                            style={{ padding: "2px 6px" }}
                          />
                          <Popconfirm
                            title="ลบรูปภาพ"
                            description="คุณแน่ใจหรือไม่ที่จะลบรูปภาพนี้?"
                            onConfirm={() => handleDeleteImage(image.id)}
                            okText="ลบ"
                            cancelText="ยกเลิก"
                          >
                            <Button
                              size="small"
                              danger
                              icon={<DeleteOutlined />}
                              style={{ padding: "2px 6px" }}
                            />
                          </Popconfirm>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            )}

            {/* New Images Upload */}
            <Card title="เพิ่มรูปภาพใหม่">
              <Upload
                listType="picture-card"
                fileList={newImageFiles}
                onChange={handleNewImageChange}
                beforeUpload={() => false}
                multiple
              >
                {newImageFiles.length >= 5 ? null : uploadButton}
              </Upload>
              <div
                style={{ marginTop: "8px", color: "#666", fontSize: "12px" }}
              >
                รองรับไฟล์: JPG, PNG, WEBP (สูงสุด 5 รูปใหม่)
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
              icon={<SaveOutlined />}
            >
              บันทึกการแก้ไข
            </Button>
          </Space>
        </Card>
      </Form>
    </div>
  );
}