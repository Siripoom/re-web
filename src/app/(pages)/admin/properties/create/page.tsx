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
  Space,
  Tag,
  Checkbox,
} from "antd";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { PropertyService } from "@/services/propertyService";

import type { UploadFile } from "antd/es/upload/interface";

const { Title } = Typography;
const { TextArea } = Input;

interface PropertyFormData {
  property_code: string; 
  name: string;
  address: string;
  description?: string;
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
  living_rooms: number;
  car_parks: number;
  price: number;
  property_type: "Villa" | "Condo" | "House" | "Apartment" | "Land";
  location?: string;
  area_sqm?: number;
  land_area_sqm?: number;
  status: "Available" | "Sold" | "Rented";
  featured: boolean;
  type: string;
  contact?: string;
  amenitie?: { 
    swimming_pool: boolean;
    fitness: boolean;
    playground: boolean;
  };
}

interface OptionType {
  value: string;
  label: string;
}

export default function CreatePropertyPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([]);
  
  // Locations state
  const [locations, setLocations] = useState<OptionType[]>([]);
  const [newLocationInput, setNewLocationInput] = useState("");

  // Property types state
  const [propertyTypes] = useState<OptionType[]>([
    { value: "Villa", label: "Villa" },
    { value: "Condo", label: "Condo" },
    { value: "House", label: "House" },
    { value: "Apartment", label: "Apartment" },
    { value: "Land", label: "Land" },
  ]);

  // Fetch locations from database on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch locations
        const locationsData = await PropertyService.getLocations();
        const locationOptions = locationsData.map((loc: string) => ({
          value: loc,
          label: loc,
        }));
        setLocations(locationOptions);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      }
    };

    fetchData();
  }, []);

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

  const handleAddNewLocation = async () => {
    if (newLocationInput.trim() === "") return;

    const newLocation = {
      value: newLocationInput,
      label: newLocationInput,
    };

    if (!locations.some(loc => loc.value.toLowerCase() === newLocationInput.toLowerCase())) {
      try {
        // This will be saved when the property is created
        setLocations([...locations, newLocation]);
        form.setFieldsValue({ location: newLocationInput });
        setNewLocationInput("");
        message.success(`เพิ่มพื้นที่ใหม่ "${newLocationInput}" เรียบร้อยแล้ว`);
      } catch (error) {
        console.error("Error adding new location:", error);
        message.error("เกิดข้อผิดพลาดในการเพิ่มพื้นที่ใหม่");
      }
    } else {
      message.warning("พื้นที่นี้มีอยู่แล้วในระบบ");
    }
  };

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
          amenitie: {
            swimming_pool: false,
            fitness: false,
            playground: false,
          },
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
                    name="property_code"
                    label="รหัสสินทรัพย์"
                    rules={[{ required: true, message: "กรุณาระบุรหัสสินทรัพย์" }]}
                  >
                    <Input placeholder="ระบุรหัสสินทรัพย์" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    name="location"
                    label="พื้นที่ตั้ง"
                    rules={[{ required: true, message: "กรุณาระบุพื้นที่ตั้ง" }]}
                  >
                    <Select
                      showSearch
                      placeholder="เลือกหรือพิมพ์พื้นที่ตั้งใหม่"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={locations}
                      onSearch={(value) => setNewLocationInput(value)}
                      dropdownRender={(menu) => (
                        <>
                          {menu}
                          {newLocationInput && !locations.some(loc => 
                            loc.value.toLowerCase() === newLocationInput.toLowerCase()
                          ) && (
                            <div style={{ padding: 8, display: 'flex', alignItems: 'center' }}>
                              <Tag color="blue" style={{ marginRight: 8 }}>ใหม่</Tag>
                              <span style={{ flex: 1 }}>{newLocationInput}</span>
                              <Button 
                                type="link" 
                                size="small"
                                onClick={handleAddNewLocation}
                                style={{ padding: 0 }}
                              >
                                เพิ่ม
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    />
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
                    <Select
                      placeholder="เลือกประเภทอสังหา"
                      options={propertyTypes}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="contact"
                    label="ช่องทางติดต่อ"
                    rules={[{ required: true, message: "กรุณาระบุช่องทางติดต่อ" }]}
                  >
                    <Input placeholder="เช่น เบอร์โทรศัพท์, อีเมล หรือ LINE ID" />
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

            {/* Amenities */}
            <Card title="สิ่งอำนวยความสะดวก" style={{ marginBottom: "16px" }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item name={['amenitie', 'swimming_pool']} valuePropName="checked">
                    <Checkbox>สระว่ายน้ำ</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={['amenitie', 'fitness']} valuePropName="checked">
                    <Checkbox>ฟิตเนส</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={['amenitie', 'playground']} valuePropName="checked">
                    <Checkbox>สนามเด็กเล่น</Checkbox>
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
                {imageFiles.length >= 13 ? null : uploadButton}
              </Upload>
              <div
                style={{ marginTop: "8px", color: "#666", fontSize: "12px" }}
              >
                รองรับไฟล์: JPG, PNG, WEBP (สูงสุด 13 รูป)
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
