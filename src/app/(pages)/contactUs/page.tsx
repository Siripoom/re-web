"use client";

import Image from "next/image";
import { Typography, Row, Col, Card } from "antd";
import { useLanguage } from "../../../components/contexts/LanguageContext";
import en from "../../../components/locales/en";
import th from "../../../components/locales/th";
import Link from "next/link";

const { Title, Paragraph } = Typography;
const translations = { en, th };

export default function ContactPage() {
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

        .hero-image {
          animation: fadeInLuxury 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }

        .contact-info-card {
          transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
          animation: fadeInLuxury 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          opacity: 0;
        }

        .contact-info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        .team-member {
          animation: fadeInLuxury 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          opacity: 0;
        }

        .map-container {
          animation: fadeInLuxury 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }

        .rounded-avatar {
          border-radius: 9999px;
          width: 120px;
          height: 120px;
          object-fit: cover;
          margin: 0 auto 1rem;
        }

        .social-icons {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #d4af37;
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
          filter: white;
        }

        .social-icon svg {
          width: 24px;
          height: 24px;
          fill: white;
        }

        .social-icon img {
          width: 24px;
          height: 24px;
          filter: brightness(0) invert(1);
          transition: all 0.3s ease;
        }

        .social-icon:hover img:not(.no-hover-effect) {
          transform: scale(1.2);
          filter: brightness(1.2) drop-shadow(0 0 6px rgba(212, 175, 55, 0.6));
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-white py-10 px-4">
          <div className="max-w-6xl mx-auto rounded-xl overflow-hidden shadow-md relative h-[500px] hero-image">
            <Image
              src="/bg.jpg"
              alt="Phuket Beach"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black opacity-15"></div>
            <div className="absolute inset-0 flex flex-col justify-end items-start text-white text-left pl-8 md:pl-16 pr-4 pb-10">
              <Title
                style={{
                  color: "white",
                  textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
                  animation:
                    "fadeInLuxury 1.8s cubic-bezier(0.19, 1, 0.22, 1) forwards",
                }}
              >
                {t("contactHeroTitle")}
              </Title>
              <Paragraph
                style={{
                  color: "white",
                  fontSize: "1.25rem",
                  textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
                  animation:
                    "fadeInLuxury 1.8s cubic-bezier(0.19, 1, 0.22, 1) forwards",
                  animationDelay: "0.3s",
                  opacity: 0,
                }}
              >
                {t("contactHeroDesc")}
              </Paragraph>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="max-w-6xl mx-auto py-12 px-4">
          <Title level={2} className="mb-8">
            {t("contactInfoTitle")}
          </Title>
          <Row gutter={[24, 24]}>
            {/* Address */}
            <Col xs={24} md={8}>
              <Card className="contact-info-card h-full">
                <Title level={4}>{t("officeAddressTitle")}</Title>
                <Paragraph>
                  {language === "th"
                    ? "111/151 หมู่ 4 ศุภาลัย เบลล่า ตำบลเกาะแก้ว  อำเภอเมือง จังหวัดภูเก็ต 83000"
                    : "111/151 Moo 4 Supalai bella  Kohkeaw Muang  Phuket 83000"}
                </Paragraph>
              </Card>
            </Col>

            {/* Contact */}
            <Col xs={24} md={8}>
              <Card className="contact-info-card h-full">
                <Title level={4}>{t("contactDetailsTitle")}</Title>
                <ul className="text-gray-800 space-y-2">
                  <li>📞 093-781-2945 , 087-276-1225</li>
                  <li>✉️ rubyagent7@gmail.com</li>
                  <li>🕒 {t("officeHours")}: 09:00 - 19:00 (Mon-Sat)</li>
                </ul>

                {/* Socials */}
                <div className="social-icons">
                  <Link
                    href="https://www.facebook.com/share/1YxgLiRMzk/?mibextid=wwXIfr"
                    className="social-icon"
                    target="_blank"
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </Link>

                  <Link
                    href="https://www.instagram.com/ruby_real_estate_phuket/"
                    className="social-icon"
                    target="_blank"
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                    </svg>
                  </Link>

                  <Link
                    href="https://line.me/ti/p/x5SIaYWNt4"
                    target="_blank"
                    className="social-icon"
                  >
                    <Image
                      src="/line-logo.svg"
                      alt="Line"
                      width={24}
                      height={24}
                      className="no-hover-effect"
                    />
                  </Link>
                </div>
              </Card>
            </Col>

            {/* Team */}
            <Col xs={24} md={8}>
              <Card className="contact-info-card h-full">
                <Title level={4}>{t("contactTeamTitle")}</Title>
                <Row gutter={16}>
                  <Col span={12} className="team-member">
                    <div className="text-center">
                      <Image
                        src="/S__8716356.jpg"
                        alt="Ruby"
                        width={120}
                        height={120}
                        className="rounded-avatar"
                      />
                      <Paragraph strong>Ruby</Paragraph>
                      <Paragraph type="secondary">{t("ceoTitle")}</Paragraph>
                    </div>
                  </Col>
                  <Col span={12} className="team-member">
                    <div className="text-center">
                      <Image
                        src="https://img.freepik.com/free-vector/businesswoman-character-avatar-isolated_24877-60111.jpg"
                        alt="Jeab"
                        width={120}
                        height={120}
                        className="rounded-avatar"
                      />
                      <Paragraph strong>Jeab</Paragraph>
                      <Paragraph type="secondary">
                        {t("salesHeadTitle")}
                      </Paragraph>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          {/* Map */}
          <div className="mt-16 map-container">
            <Title level={2}>{t("mapTitle")}</Title>
            <div className="rounded-xl overflow-hidden shadow-md h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.455789379352!2d98.30191131536415!3d8.03219499419961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3051f1e9f1a7c3a9%3A0x7f5e7d5b5e5e5e5e!2s123%20Beach%20Road%2C%20Kamala%2C%20Phuket%2083150%2C%20Thailand!5e0!3m2!1sen!2sth!4v1620000000000!5m2!1sen!2sth"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
