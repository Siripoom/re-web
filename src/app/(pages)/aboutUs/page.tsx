"use client";

import Image from "next/image";
import Link from "next/link";
import { Typography, Row, Col, Card, Button } from "antd";
import { useLanguage } from "../../../components/contexts/LanguageContext";
import en from "../../../components/locales/en";
import th from "../../../components/locales/th";

const { Title, Paragraph } = Typography;
const translations = { en, th };

export default function AboutPage() {
  const { language } = useLanguage();
  const t = (key: keyof typeof en) => translations[language][key];

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInLuxury {
          from {
            opacity: 0;
            transform: translateY(30px);
            filter: blur(2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        @keyframes goldShimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }
        .hero-image {
          animation: fadeInLuxury 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        .mission-section p {
          animation: fadeInLuxury 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          opacity: 0;
        }
        .mission-section p:nth-child(1) {
          animation-delay: 0.5s;
        }
        .mission-section p:nth-child(2) {
          animation-delay: 0.8s;
        }
        .mission-section p:nth-child(3) {
          animation-delay: 1.1s;
        }
        .team-card {
          transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
          animation: fadeInLuxury 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          opacity: 0;
        }
        .team-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }
        .team-card:nth-child(1) {
          animation-delay: 0.6s;
        }
        .team-card:nth-child(2) {
          animation-delay: 0.9s;
        }
        .expertise-image {
          animation: fadeInLuxury 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.3);
          animation-delay: 0.4s;
        }
        .expertise-item {
          animation: fadeInLuxury 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          opacity: 0;
        }
        .expertise-item:nth-child(1) {
          animation-delay: 0.7s;
        }
        .expertise-item:nth-child(2) {
          animation-delay: 1s;
        }
        .expertise-item:nth-child(3) {
          animation-delay: 1.3s;
        }
        .luxury-gold-button {
          position: relative;
          overflow: hidden;
          border: none;
          font-weight: 600;
          transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
          background: linear-gradient(
            45deg,
            #d4af37 0%,
            #f9d423 50%,
            #d4af37 100%
          );
          background-size: 200% 200%;
          color: #000;
          transform-style: preserve-3d;
          perspective: 1000px;
          animation: goldShimmer 6s linear infinite;
        }
        .luxury-gold-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            #1a1a1a 0%,
            #2d2d2d 50%,
            #1a1a1a 100%
          );
          background-size: 200% 200%;
          opacity: 0;
          transition: opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1);
          z-index: 1;
        }
        .luxury-gold-button:hover {
          background-position: 100% 100%;
          color: #d4af37;
        }
        .luxury-gold-button:hover::before {
          opacity: 1;
        }
        .luxury-gold-button span {
          position: relative;
          z-index: 2;
          transition: color 0.8s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .luxury-gold-button:hover span {
          color: #d4af37;
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }
        .cta-section {
          background: linear-gradient(135deg, #f5f7fa 0%, #f8f9fa 100%);
          position: relative;
          overflow: hidden;
          animation: fadeInLuxury 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }
        .cta-section::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(212, 175, 55, 0.08) 0%,
            rgba(0, 0, 0, 0) 70%
          );
          animation: rotate 20s linear infinite;
        }
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Hero Section - Updated */}
        <div className="relative w-full h-screen">
          <div className="absolute inset-0">
            <Image
              src="/bg.jpg"
              alt="Phuket Beach"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black opacity-15"></div>
          </div>

          <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4">
            <div className="max-w-4xl mx-auto">
              <Title
                className="mb-6"
                style={{
                  color: "white",
                  textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
                  animation: "fadeInLuxury 1.8s cubic-bezier(0.19, 1, 0.22, 1) forwards",
                  fontSize: "3.5rem",
                }}
              >
                {t("aboutHeroTitle")}
              </Title>
              <Paragraph
                style={{
                  color: "white",
                  fontSize: "1.2rem",
                  textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
                  animation: "fadeInLuxury 1.8s cubic-bezier(0.19, 1, 0.22, 1) forwards",
                  animationDelay: "0.3s",
                  opacity: 0,
                }}
              >
                {t("aboutHeroDesc")}
              </Paragraph>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto py-12 px-4">
          <section className="mb-16 mission-section">
            <Title
              level={2}
              style={{
                animation:
                  "fadeInLuxury 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards",
                opacity: 0,
                fontSize: "2.25rem",
              }}
            >
              {t("aboutMissionTitle")}
            </Title>
              <Paragraph style={{ fontSize: '18px' }}>{t("aboutMission1")}</Paragraph>
              <Paragraph style={{ fontSize: '18px' }}>{t("aboutMission2")}</Paragraph>
              <Paragraph style={{ fontSize: '18px' }}>{t("aboutMission3")}</Paragraph>

          </section>

          <section className="mb-16 text-center">
            <Title
              level={2}
              style={{
                animation:
                  "fadeInLuxury 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards",
                opacity: 0,
                animationDelay: "0.3s",
              }}
            >
              {t("aboutTeamTitle")}
            </Title>
            <Row justify="center" gutter={[32, 32]} className="mt-10">
              <Col xs={24} md={8}>
                <Card className="team-card" hoverable>
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center">
                    <Image
                      src="/S__8716356.jpg"
                      alt="Sophia Chen"
                      width={128}
                      height={128}
                      className="object-contain"
                    />
                  </div>
                  <Title level={4}>Ruby</Title>
                  <Paragraph style={{ fontSize: '18px' }}>{t("aboutTeamCEO")}</Paragraph>
                  <Paragraph type="secondary" style={{ fontSize: '16px' }}>
                    {t("aboutTeamCEODesc")}
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className="team-card" hoverable>
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center">
                    <Image
                      src="https://img.freepik.com/free-vector/businesswoman-character-avatar-isolated_24877-60111.jpg"
                      alt="Ethan Lee"
                      width={128}
                      height={128}
                      className="object-contain"
                    />
                  </div>
                  <Title level={4}>Jeab</Title>
                  <Paragraph style={{ fontSize: '18px' }}>{t("aboutTeamHeadSales")}</Paragraph>
                  <Paragraph type="secondary" style={{ fontSize: '16px' }}>
                    {t("aboutTeamSalesDesc")}
                  </Paragraph>
                </Card>
              </Col>
            </Row>
          </section>

          <section>
            <Title
              level={2}
              className="text-center"
              style={{
                animation:
                  "fadeInLuxury 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards",
                opacity: 0,
                animationDelay: "0.3s",
              }}
            >
              {t("aboutExpertiseTitle")}
            </Title>
            <Paragraph
              className="text-center max-w-3xl mx-auto"
              style={{
                animation:
                  "fadeInLuxury 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards",
                opacity: 0,
                animationDelay: "0.5s",
                fontSize: "16px",
              }}
            >
              {t("aboutExpertiseDesc")}
            </Paragraph>

            <Row gutter={[32, 32]} align="middle" className="mt-8">
              <Col md={12}>
                <Image
                  src="https://images.unsplash.com/photo-1600121848594-d8644e57abab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Luxury Villa"
                  width={600}
                  height={400}
                  className="rounded-lg expertise-image"
                />
              </Col>
              <Col md={12}>
                <ul className="space-y-6">
                  <li className="expertise-item">
                    <Title level={4} style={{ fontSize: '18px' }}>{t("aboutExpertise1Title")}</Title>
                    <Paragraph style={{ fontSize: '16px' }}>{t("aboutExpertise1Desc")}</Paragraph>
                  </li>
                  <li className="expertise-item">
                    <Title level={4} style={{ fontSize: '18px' }}>{t("aboutExpertise2Title")}</Title>
                    <Paragraph style={{ fontSize: '16px' }}>{t("aboutExpertise2Desc")}</Paragraph>
                  </li>
                  <li className="expertise-item">
                    <Title level={4} style={{ fontSize: '18px' }}>{t("aboutExpertise3Title")}</Title>
                    <Paragraph style={{ fontSize: '16px' }}>{t("aboutExpertise3Desc")}</Paragraph>
                  </li>
                </ul>
              </Col>
            </Row>
          </section>

          <section className="mt-16 text-center cta-section rounded-xl p-12 relative">
            <div className="relative z-10">
              <Title level={2} >{t("aboutCTAHeadline")}</Title>
              <Paragraph className="max-w-2xl mx-auto" style={{ fontSize: '16px' }}>
                {t("aboutCTADesc")}
              </Paragraph>
              <Link href="/contactUs" className="inline-block mt-6">
                <Button className="luxury-gold-button" size="large">
                  <span style={{ fontSize: '18px' }}>{t("contactUs")}</span>
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}