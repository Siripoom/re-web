// src/app/(pages)/admin/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Table,
  Tag,
  Space,
  Button,
  Progress,
  Divider,
  Avatar,
  List,
  Badge,
  Tooltip,
} from "antd";
import {
  HomeOutlined,
  DollarOutlined,
  EyeOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PieChartOutlined,
  BarChartOutlined,
  RiseOutlined,
  FallOutlined,
  CalendarOutlined,
  UserOutlined,
  StarOutlined,
  StarFilled,
  EnvironmentOutlined,
  FireOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { PropertyService } from "@/services/propertyService";
import type { Property } from "@/types/property";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  rentedProperties: number;
  propertyTypeStats: Record<string, number>;
  locationStats: Record<string, number>;
}

interface PropertyTypeData {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

interface LocationData {
  location: string;
  count: number;
  percentage: number;
  avgPrice: number;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertyTypeData, setPropertyTypeData] = useState<PropertyTypeData[]>(
    []
  );
  const [locationData, setLocationData] = useState<LocationData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, propertiesData, featuredData] = await Promise.all([
          PropertyService.getPropertyStats(),
          PropertyService.getAllProperties(),
          PropertyService.getFeaturedProperties(),
        ]);

        setStats(statsData);
        setAllProperties(propertiesData);
        setRecentProperties(propertiesData.slice(0, 5));
        setFeaturedProperties(featuredData.slice(0, 3));

        // Process property type data
        const typeColors = [
          "#1890ff",
          "#52c41a",
          "#faad14",
          "#f5222d",
          "#722ed1",
          "#13c2c2",
        ];
        const processedTypeData = Object.entries(statsData.propertyTypeStats)
          .map(([type, count], index) => ({
            type,
            count,
            percentage: Math.round((count / statsData.totalProperties) * 100),
            color: typeColors[index % typeColors.length],
          }))
          .sort((a, b) => b.count - a.count);
        setPropertyTypeData(processedTypeData);

        // Process location data with average prices
        const processedLocationData = Object.entries(statsData.locationStats)
          .map(([location, count]) => {
            const locationProperties = propertiesData.filter(
              (p) => p.location === location
            );
            const avgPrice =
              locationProperties.length > 0
                ? locationProperties.reduce(
                    (sum, p) => sum + (p.price || 0),
                    0
                  ) / locationProperties.length
                : 0;

            return {
              location,
              count,
              percentage: Math.round((count / statsData.totalProperties) * 100),
              avgPrice,
            };
          })
          .sort((a, b) => b.count - a.count);
        setLocationData(processedLocationData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const quickActions: QuickAction[] = [
    {
      title: "เพิ่มอสังหาใหม่",
      description: "เพิ่มอสังหาริมทรัพย์ใหม่เข้าสู่ระบบ",
      icon: <HomeOutlined />,
      color: "#1890ff",
      path: "/admin/properties/create",
    },
    {
      title: "จัดการอสังหา",
      description: "ดู แก้ไข และจัดการอสังหาทั้งหมด",
      icon: <BarChartOutlined />,
      color: "#52c41a",
      path: "/admin/properties",
    },
    {
      title: "อสังหาแนะนำ",
      description: "จัดการอสังหาที่แสดงในหน้าแรก",
      icon: <StarOutlined />,
      color: "#faad14",
      path: "/admin/properties?featured=true",
    },
  ];

  const recentPropertiesColumns = [
    {
      title: "รูปภาพ",
      dataIndex: "images",
      key: "image",
      width: 60,
      render: (images: any[]) => {
        const primaryImage =
          images?.find((img) => img.is_primary) || images?.[0];
        return (
          <Avatar
            shape="square"
            size={40}
            src={primaryImage?.image_url}
            icon={<HomeOutlined />}
            style={{ borderRadius: "6px" }}
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
          <Text strong style={{ fontSize: "14px" }}>
            {text.length > 25 ? `${text.substring(0, 25)}...` : text}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: "11px" }}>
            {record.location}
          </Text>
        </div>
      ),
    },
    {
      title: "ประเภท",
      dataIndex: "property_type",
      key: "property_type",
      render: (type: string) => (
        <Tag color="blue" style={{ fontSize: "11px" }}>
          {type}
        </Tag>
      ),
    },
    {
      title: "ราคา",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <Text strong style={{ fontSize: "12px", color: "#1890ff" }}>
          {price?.toLocaleString("th-TH")} ฿
        </Text>
      ),
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: Property) => (
        <Space direction="vertical" size={0}>
          <Tag
            color={
              status === "Available"
                ? "green"
                : status === "Sold"
                ? "red"
                : "orange"
            }
            style={{ fontSize: "10px", margin: 0 }}
          >
            {status === "Available"
              ? "พร้อมขาย"
              : status === "Sold"
              ? "ขายแล้ว"
              : "ให้เช่า"}
          </Tag>
          {record.featured && (
            <Tag color="gold" style={{ fontSize: "9px", margin: "2px 0 0 0" }}>
              แนะนำ
            </Tag>
          )}
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #f3f3f3",
            borderTop: "3px solid #1890ff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "16px",
          }}
        />
        <Text style={{ fontSize: "16px", color: "#666" }}>
          กำลังโหลดข้อมูล...
        </Text>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  const availabilityRate = stats
    ? Math.round((stats.availableProperties / stats.totalProperties) * 100)
    : 0;
  const salesRate = stats
    ? Math.round((stats.soldProperties / stats.totalProperties) * 100)
    : 0;
  const totalValue = allProperties.reduce((sum, p) => sum + (p.price || 0), 0);
  const avgPrice =
    allProperties.length > 0 ? totalValue / allProperties.length : 0;

  return (
    <div style={{ padding: "0", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Welcome Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
          padding: "32px 24px",
          borderRadius: "0 0 24px 24px",
          marginBottom: "24px",
          color: "white",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title
              level={1}
              style={{ margin: 0, color: "white", fontSize: "32px" }}
            >
              สวัสดี Admin! 👋
            </Title>
            <Text style={{ fontSize: "16px", color: "rgba(255,255,255,0.9)" }}>
              ยินดีต้อนรับสู่ระบบจัดการอสังหาริมทรัพย์ Ruby Real Estate
            </Text>
          </Col>
          <Col>
            <div style={{ textAlign: "right" }}>
              <Text
                style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}
              >
                <CalendarOutlined style={{ marginRight: "8px" }} />
                {new Date().toLocaleDateString("th-TH", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </div>
          </Col>
        </Row>
      </div>

      <div style={{ padding: "0 24px" }}>
        {/* Quick Actions */}
        <Card
          title={
            <Space>
              <ThunderboltOutlined style={{ color: "#faad14" }} />
              <span>การดำเนินการด่วน</span>
            </Space>
          }
          style={{ marginBottom: "24px" }}
        >
          <Row gutter={[16, 16]} justify="center">
            {quickActions.map((action, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card
                  hoverable
                  onClick={() => router.push(action.path)}
                  style={{
                    height: "120px",
                    cursor: "pointer",
                    border: `2px solid ${action.color}20`,
                    borderRadius: "12px",
                  }}
                  bodyStyle={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      color: action.color,
                      fontSize: "24px",
                      marginBottom: "8px",
                    }}
                  >
                    {action.icon}
                  </div>
                  <Text
                    strong
                    style={{ fontSize: "14px", marginBottom: "4px" }}
                  >
                    {action.title}
                  </Text>
                  <Text type="secondary" style={{ fontSize: "11px" }}>
                    {action.description}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Main Statistics */}
        <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: "linear-gradient(135deg, #1890ff, #36cfc9)",
                border: "none",
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "rgba(255,255,255,0.9)" }}>
                    อสังหาทั้งหมด
                  </span>
                }
                value={stats?.totalProperties || 0}
                prefix={<HomeOutlined style={{ color: "white" }} />}
                valueStyle={{
                  color: "white",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
                suffix={
                  <span
                    style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}
                  >
                    รายการ
                  </span>
                }
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: "linear-gradient(135deg, #52c41a, #73d13d)",
                border: "none",
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "rgba(255,255,255,0.9)" }}>
                    พร้อมขาย
                  </span>
                }
                value={stats?.availableProperties || 0}
                prefix={<EyeOutlined style={{ color: "white" }} />}
                valueStyle={{
                  color: "white",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
                suffix={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: "14px",
                      }}
                    >
                      ({availabilityRate}%)
                    </span>
                    <ArrowUpOutlined
                      style={{ fontSize: "12px", color: "white" }}
                    />
                  </div>
                }
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: "linear-gradient(135deg, #fa541c, #ff7a45)",
                border: "none",
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "rgba(255,255,255,0.9)" }}>
                    ขายแล้ว
                  </span>
                }
                value={stats?.soldProperties || 0}
                prefix={<DollarOutlined style={{ color: "white" }} />}
                valueStyle={{
                  color: "white",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
                suffix={
                  <span
                    style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}
                  >
                    ({salesRate}%)
                  </span>
                }
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: "linear-gradient(135deg, #722ed1, #9254de)",
                border: "none",
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "rgba(255,255,255,0.9)" }}>
                    ให้เช่าแล้ว
                  </span>
                }
                value={stats?.rentedProperties || 0}
                prefix={<TrophyOutlined style={{ color: "white" }} />}
                valueStyle={{
                  color: "white",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
                suffix={
                  <span
                    style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}
                  >
                    รายการ
                  </span>
                }
              />
            </Card>
          </Col>
        </Row>

        {/* Charts and Analytics */}
        <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
          {/* Property Types */}
          <Col xs={24} lg={24}>
            <Card
              title={
                <Space>
                  <PieChartOutlined style={{ color: "#1890ff" }} />
                  <span>สัดส่วนประเภทอสังหา</span>
                  <Badge
                    count={propertyTypeData.length}
                    style={{ backgroundColor: "#52c41a" }}
                  />
                </Space>
              }
              style={{ height: "400px" }}
              extra={
                <Button type="text" size="small">
                  ดูทั้งหมด
                </Button>
              }
            >
              <div
                style={{ height: "280px", overflowY: "auto", padding: "8px 0" }}
              >
                {propertyTypeData.map((item, index) => (
                  <div key={item.type} style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <Space>
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: item.color,
                            borderRadius: "50%",
                          }}
                        />
                        <Text strong style={{ fontSize: "14px" }}>
                          {item.type}
                        </Text>
                      </Space>
                      <Space>
                        <Text style={{ fontSize: "13px", color: "#666" }}>
                          {item.count} รายการ
                        </Text>
                        <Text
                          strong
                          style={{ color: item.color, fontSize: "14px" }}
                        >
                          {item.percentage}%
                        </Text>
                      </Space>
                    </div>
                    <Progress
                      percent={item.percentage}
                      strokeColor={item.color}
                      trailColor="#f0f0f0"
                      strokeWidth={8}
                      showInfo={false}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Bottom Section */}
        <Row gutter={[24, 24]}>
          {/* Recent Properties */}
          <Col xs={24}>
            <Card
              title={
                <Space>
                  <HomeOutlined style={{ color: "#1890ff" }} />
                  <span>อสังหาล่าสุด</span>
                  <Badge
                    count={recentProperties.length}
                    style={{ backgroundColor: "#52c41a" }}
                  />
                </Space>
              }
              extra={
                <Button
                  type="primary"
                  onClick={() => router.push("/admin/properties")}
                >
                  ดูทั้งหมด
                </Button>
              }
            >
              <Table
                columns={recentPropertiesColumns}
                dataSource={recentProperties}
                rowKey="id"
                pagination={false}
                size="small"
                locale={{ emptyText: "ไม่มีข้อมูลอสังหาริมทรัพย์" }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
