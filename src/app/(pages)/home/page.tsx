'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Input, Button, Typography, Row, Col, Card, Spin, Alert } from 'antd';
import { useLanguage } from '../../../components/contexts/LanguageContext';
import { usePropertyContext } from '../../../components/contexts/PropertyContext';
import en from '../../../components/locales/en';
import th from '../../../components/locales/th';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;

const translations = { en, th };

export default function Home() {
  const { featuredProperties, loading } = usePropertyContext();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/product?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/product');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="bg-white py-10 px-4 relative">
        <div
          className={`max-w-6xl mx-auto rounded-xl overflow-hidden shadow-md relative h-[500px] transition-all duration-500 ${
            loading ? 'blur-[1px]' : 'blur-none'
          }`}
        >
          <Image
            src="/header1.jpeg"
            alt="Phuket Beach"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-15"></div>

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-end items-start text-white text-left pl-8 md:pl-16 pr-4 pb-10 z-10 space-y-5">
            {!loading && (
              <>
                <div className="animate-fadeInUp">
                  <Title level={1} className="!text-white !text-4xl md:!text-5xl">
                    {language === 'th'
                      ? 'ค้นหาบ้านในฝันของคุณที่ภูเก็ต'
                      : 'Find your dream home in Phuket'}
                  </Title>
                </div>

                <div className="animate-fadeInUp delay-150">
                  <Paragraph className="!text-white !text-lg md:!text-xl">
                    {language === 'th'
                      ? 'สำรวจอสังหาริมทรัพย์หรูเฉพาะของเราที่ภูเก็ตในทำเลที่เป็นที่ต้องการที่สุด'
                      : "Explore our exclusive collection of luxury properties in Phuket's most sought-after locations."}
                  </Paragraph>
                </div>

                <div className="w-full max-w-xl flex animate-fadeInUp delay-300">
                  <div className="relative w-full bg-white rounded-lg p-1 flex">
                    <Input
                      placeholder={
                        language === 'th'
                          ? 'ค้นหาจากทำเล ประเภทอสังหา หรือคำสำคัญ'
                          : 'Search by location, property type, or keyword'
                      }
                      className="flex-1 !border-0 !shadow-none !text-base"
                      size="large"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onPressEnter={handleSearch}
                    />
                    <Button
                      type="primary"
                      size="large"
                      className="!bg-gradient-to-r !from-[#D4AF37] !to-[#FFD700] !border-none !text-white !text-base hover:!scale-105 transition-transform"
                      onClick={handleSearch}
                    >
                      {language === 'th' ? 'ค้นหา' : 'Search'}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
              <Spin
                size="large"
                className="!mb-4"
                indicator={
                  <span className="ant-spin-dot ant-spin-dot-spin">
                    <i className="ant-spin-dot-item gold-dot" />
                    <i className="ant-spin-dot-item gold-dot" />
                    <i className="ant-spin-dot-item gold-dot" />
                    <i className="ant-spin-dot-item gold-dot" />
                  </span>
                }
              />
              <Alert
                message={language === 'th' ? 'กำลังโหลดข้อมูล...' : 'Loading data...'}
                type="info"
                showIcon
                className="!text-base !text-[#D4AF37] !bg-[#FFF8E1] !border-[#FFD700]"
                icon={
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="loading"
                    width="1em"
                    height="1em"
                    fill="#D4AF37"
                    aria-hidden="true"
                  >
                    <path d="M988 548H836c-4.4 0-8-3.6-8-8s3.6-8 8-8h152c4.4 0 8 3.6 8 8s-3.6 8-8 8zM188 540c0 4.4-3.6 8-8 8H28c-4.4 0-8-3.6-8-8s3.6-8 8-8h152c4.4 0 8 3.6 8 8zm661.3 287.3c-3.1 3.1-8.2 3.1-11.3 0L722.3 711c-3.1-3.1-3.1-8.2 0-11.3s8.2-3.1 11.3 0l115.7 115.6c3.2 3.1 3.2 8.2.3 11.3z" />
                  </svg>
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Featured Section */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {!loading && (
            <Title level={2} className="text-center text-gray-800 mb-10 !text-3xl">
              {language === 'th' ? 'อสังหาริมทรัพย์แนะนำ' : 'Featured Properties'}
            </Title>
          )}

          <Row gutter={[16, 16]} className="animate-fadeIn">
            {!loading
              ? featuredProperties.map((property) => {
                  const primaryImage =
                    property.images?.find((img) => img.is_primary)?.image_url ||
                    property.images?.[0]?.image_url ||
                    '/placeholder-property.jpg';

                  return (
                    <Col xs={24} md={8} key={property.id}>
                      <Link href={`/property/${property.id}`} className="hover:no-underline">
                        <Card
                          hoverable
                          className="transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
                          cover={
                            <div className="h-[200px] relative overflow-hidden">
                              <Image
                                src={primaryImage}
                                alt={property.name}
                                fill
                                className="object-cover transition-transform duration-500 hover:scale-105"
                              />
                            </div>
                          }
                        >
                          <Card.Meta
                            title={<span className="!text-lg">{property.name}</span>}
                            description={
                              <>
                                <div className="!text-base">
                                  🛏 {property.bedrooms} | 🚿 {property.bathrooms} | 🏠 {property.property_type} | 📌 {property.type}
                                </div>
                                <div className="text-[#D4AF37] font-semibold mt-1 !text-base">
                                  {property.price.toLocaleString('en-US')} THB
                                </div>
                              </>
                            }
                          />
                        </Card>
                      </Link>
                    </Col>
                  );
                })
              : Array.from({ length: 3 }).map((_, index) => (
                  <Col xs={24} md={8} key={index}>
                    <div className="skeleton-card p-4">
                      <div className="skeleton-image" />
                      <div className="p-3">
                        <div className="skeleton-line skeleton-line--title" />
                        <div className="skeleton-line skeleton-line--text" />
                        <div className="skeleton-line skeleton-line--price" />
                      </div>
                    </div>
                  </Col>
                ))}
          </Row>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }

        .delay-150 {
          animation-delay: 0.15s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .gold-dot {
          background-color: #D4AF37 !important;
        }

        .skeleton-title {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
          border-radius: 4px;
        }

        .skeleton-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          height: 100%;
        }

        .skeleton-image {
          height: 200px;
          width: 100%;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }

        .skeleton-line {
          height: 14px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
          border-radius: 4px;
        }

        .skeleton-line--title {
          height: 20px;
          width: 70%;
          margin-bottom: 16px;
        }

        .skeleton-line--text {
          height: 12px;
          width: 90%;
          margin-bottom: 8px;
        }

        .skeleton-line--price {
          height: 16px;
          width: 50%;
          margin-top: 12px;
        }
      `}</style>
    </>
  );
}