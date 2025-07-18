"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  Typography,
  Row,
  Col,
  Card,
  Image,
  Spin,
  Button,
  Divider,
  Result,
  Tag,
} from "antd";
import { useLanguage } from "../../../../components/contexts/LanguageContext";
import en from "../../../../components/locales/en";
import th from "../../../../components/locales/th";
import { PropertyService } from "@/services/propertyService";
import type { Property } from "@/types/property";
import Link from "next/link";

const translations = { en, th };
const { Title, Text, Paragraph } = Typography;

export default function PropertyDetails() {
  const router = useRouter();
  const params = useParams();
  const { language } = useLanguage();
  const t = (key: keyof typeof en) => translations[language][key];

  const propertyId = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await PropertyService.getPropertyById(propertyId);
        if (!data) throw new Error("Not found");
        setProperty(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        router.push("/properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId]);

  if (loading) {
    return (
      <>
        <style jsx global>{`
          @keyframes shine {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          @keyframes pulse {
            0% {
              transform: scale(0.9);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.1);
              opacity: 1;
            }
            100% {
              transform: scale(0.9);
              opacity: 0.7;
            }
          }
          .gold-spinner .ant-spin-dot-item {
            background-color: #d4af37 !important;
            box-shadow: 0 0 10px rgba(212, 175, 55, 0.7);
          }
          .ant-spin-dot {
            animation: pulse 1.5s infinite ease-in-out;
          }
        `}</style>
        <Row justify="center" align="middle" style={{ minHeight: "80vh" }}>
          <div
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <Spin size="large" className="gold-spinner" />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
                backgroundSize: "200% 100%",
                animation: "shine 2s infinite",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
            ></div>
          </div>
        </Row>
      </>
    );
  }

  if (!property) {
    return (
      <Result
        status="404"
        title={t("notFound")}
        subTitle={t("propertyNotFound")}
        extra={
          <Button type="primary" onClick={() => router.push("/properties")}>
            {t("backToProperties")}
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ padding: "24px" ,fontSize:"18px" }}>
      <Breadcrumb
        items={[
          { title: <Link href="/">{t("home")}</Link> },
          { title: <Link href="/properties">{t("properties")}</Link> },
          { title: property.name },
        ]}
      />

      <Title level={2} style={{ marginTop: 16 }}>
        {property.name}
      </Title>

      <Text
        type="secondary" 
        style={{
          display: "block",
          marginBottom: 4,
          whiteSpace: "normal",
          wordBreak: "break-word",
          fontSize: "22px",
        }}
      >
        📍 {property.location}
      </Text>

      <Text type="secondary" style={{ fontSize: "22px" }}>
        🏠 {property.property_type}
      </Text>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Image.PreviewGroup>
            <Image
              width="100%"
              height={400}
              style={{ objectFit: "cover", borderRadius: 12 }}
              src={property.images?.[0]?.image_url || "/default-property.jpg"}
              alt={property.name}
            />
          </Image.PreviewGroup>

          <Divider style={{ fontSize: "22px" }} orientation="left">{t("description")}</Divider>
          <Paragraph style={{ fontSize: "18px" }}>
            {property.description?.split("\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Paragraph>

          {property.address && (
            <>
              <Divider orientation="left" style={{ fontSize: "22px" }}>
                {language === "th" ? "แผนที่" : "Location Map"}
              </Divider>
              <Paragraph type="secondary" style={{ fontSize: "18px" }}>{property.address}</Paragraph>
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  property.address
                )}&output=embed`}
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: "10px" }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </>
          )}
        </Col>

        <Col xs={24} lg={8}>
          <Card
            style={{
              borderRadius: 10,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Title level={3} style={{ color: "#D4AF37" }}>
              ฿{property.price.toLocaleString()}
            </Title>

            <Row gutter={[16, 16]} style={{ marginTop: 16,fontSize: "18px" }}>
              <Col span={12}>
                <Text style={{ fontSize: "18px" }}>{t("bedrooms")}:</Text>
                  <br />
                  <strong style={{ fontSize: "20px" }}>{property.bedrooms}</strong>
              </Col>
              <Col span={12}>
                <Text style={{ fontSize: "18px" }}>{t("bathrooms")}:</Text>
                <br />
                <strong style={{ fontSize: "20px" }}> {property.bathrooms}</strong>
              </Col>
              <Col span={12}>
                <Text style={{ fontSize: "18px" }}>{t("kitchens")}:</Text>
                <br />
                <strong style={{ fontSize: "20px" }}>{property.kitchens ?? "-"}</strong>
              </Col>
              <Col span={12}>
                <Text style={{ fontSize: "18px" }}>{t("livingRooms")}:</Text>
                <br />
                <strong style={{ fontSize: "20px" }}>{property.living_rooms ?? "-"}</strong>
              </Col>
              <Col span={12}>
                <Text style={{ fontSize: "18px" }}>{t("carParks")}:</Text>
                <br />
                <strong style={{ fontSize: "20px" }}> {property.car_parks ?? "-"}</strong>
              </Col>
              <Col span={12}>
                <Text style={{ fontSize: "18px" }}> {t("area")}:</Text>
                <br />
                <strong style={{ fontSize: "20px" }}> {property.area_sqm} sqm</strong>
              </Col>
              <Col span={12}>
                <Text style={{ fontSize: "18px" }}> {t("landArea")}:</Text>
                <br />
                <strong style={{ fontSize: "20px" }}> {property.land_area_sqm ?? "-"} sqm</strong>
              </Col>
              <Col span={12}>
                <Text style={{ fontSize: "18px" }}> {t("type")}:</Text>
                <br />
                <strong style={{ fontSize: "20px" }}> {property.type}</strong>
              </Col>
              <Col span={24}>
                <Text style={{ fontSize: "18px" }}> {t("status")}:</Text>
                <br />
                <strong style={{ fontSize: "20px" }}> {property.status}</strong>
              </Col>
            </Row>

            <Button
              href="/contactUs"
              type="primary"
              block
              style={{
                marginTop: 24,
                backgroundColor: "#D4AF37",
                borderColor: "#C9A227",
                height: "40px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {t("contactAgent")}
            </Button>
          </Card>
        </Col>
      </Row>

      {property.amenities?.length > 0 && (
        <>
          <Divider orientation="left">{t("amenities")}</Divider>
          <Row gutter={[12, 12]}>
            {property.amenities.map((item: string, i: number) => (
              <Col key={i}>
                <Tag
                  style={{
                    backgroundColor: "rgba(212, 175, 55, 0.1)",
                    color: "#D4AF37",
                    borderColor: "#D4AF37",
                    padding: "4px 12px",
                    borderRadius: "4px",
                  }}
                >
                  {item}
                </Tag>
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
}