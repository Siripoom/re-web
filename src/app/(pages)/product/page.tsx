'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Input, Select, Typography, Row, Col, Card, Button } from 'antd';
import { usePropertyContext } from '../../../components/contexts/PropertyContext';
import { useLanguage } from '../../../components/contexts/LanguageContext';
import en from '../../../components/locales/en';
import th from '../../../components/locales/th';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const { Title } = Typography;
const { Option } = Select;

const translations = { en, th };

export default function PropertySearch() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [propertyFormat, setPropertyFormat] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const { allProperties: properties, loading } = usePropertyContext();
  const { language } = useLanguage();
  const t = (key: keyof typeof en) => translations[language][key];

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(decodeURIComponent(searchQuery));
    }
  }, [searchParams]);

  const filteredProperties = properties.filter(property => {
    return (
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (location === '' || property.location === location) &&
      (property.property_type === propertyType || propertyType === '') &&
      (propertyFormat === '' || property.type === propertyFormat) &&
      (priceRange === '' ||
        (priceRange === '0-10' && property.price < 10000000) ||
        (priceRange === '10-20' && property.price >= 10000000 && property.price < 20000000) ||
        (priceRange === '20+' && property.price >= 20000000))
    );
  });

  const locations = Array.from(new Set(properties.map(p => p.location).filter(loc => loc !== undefined && loc !== null)));
  const propertyTypes = Array.from(new Set(properties.map(p => p.property_type).filter(type => type !== undefined && type !== null)));
  const propertyFormats = Array.from(new Set(properties.map(p => p.type).filter(format => format !== undefined && format !== null)));
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="skeleton-title mb-6"></div>
        ) : (
          <Title level={2} className="animate-fadeIn">{t('product')}</Title>
        )}

        {loading ? (
          <div className="skeleton-search mb-6"></div>
        ) : (
        <Input.Search
          placeholder={t('search') || 'Search'}
          enterButton={
            <Button type="primary" className="gold-search-button">
              {t('searchbtn') || 'Search'}
            </Button>
          }
          allowClear
          size="large"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6 animate-fadeIn gold-search-btn"
        />
        )}

        <Row gutter={[16, 16]} className="mb-8">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((item) => (
                <Col xs={24} sm={12} md={6} key={item}>
                  <div className="skeleton-filter"></div>
                </Col>
              ))}
            </>
          ) : (
            <>
              <Col xs={24} sm={12} md={6} className="animate-fadeIn delay-100">
                <Select
                  placeholder={t('location') || 'Location'}
                  value={location || undefined}
                  onChange={(value) => setLocation(value)}
                  style={{ width: '100%' }}
                  allowClear
                >
                  {locations.map(loc => (
                    <Option key={loc} value={loc}>{loc}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6} className="animate-fadeIn delay-200">
                <Select
                  placeholder={t('propertyType') || 'Property Type'}
                  value={propertyType || undefined}
                  onChange={(value) => setPropertyType(value)}
                  style={{ width: '100%' }}
                  allowClear
                >
                  {propertyTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6} className="animate-fadeIn delay-300">
                <Select
                  placeholder={t('propertyFormat') || 'Property Format'}
                  value={propertyFormat || undefined}
                  onChange={(value) => setPropertyFormat(value)}
                  style={{ width: '100%' }}
                  allowClear
                >
                  {propertyFormats.map(format => (
                    <Option key={format} value={format}>{format}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6} className="animate-fadeIn delay-400">
                <Select
                  placeholder={t('priceRange') || 'Price Range'}
                  value={priceRange || undefined}
                  onChange={(value) => setPriceRange(value)}
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Option value="0-10">0 - 10M</Option>
                  <Option value="10-20">10M - 20M</Option>
                  <Option value="20+">20M+</Option>
                </Select>
              </Col>
            </>
          )}
        </Row>

        <div className="mt-8">
          {loading ? (
            <Row gutter={[16, 16]}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Col xs={24} sm={12} md={8} key={item}>
                  <div className="skeleton-card">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-content">
                      <div className="skeleton-line skeleton-line--title"></div>
                      <div className="skeleton-line skeleton-line--text"></div>
                      <div className="skeleton-line skeleton-line--price"></div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <Row gutter={[16, 16]}>
              {filteredProperties.map((property, index) => {
                const primaryImage =
                  property.images?.find(img => img.is_primary)?.image_url ||
                  property.images?.[0]?.image_url ||
                  '/placeholder-property.jpg';

                return (
                  <Col 
                    xs={24} 
                    sm={12} 
                    md={8} 
                    key={property.id}
                    className="animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link href={`/property/${property.id}`} className="hover:no-underline">
                      <Card
                        hoverable
                        className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 gold-card"
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
              })}
            </Row>
          )}

          {!loading && filteredProperties.length === 0 && (
            <div className="text-center py-12 animate-fadeIn">
              <h3 className="text-xl font-medium text-gray-600">{t('noMatch')}</h3>
              <p className="text-gray-500 mt-2">{t('tryAdjustFilters')}</p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        /* Animation Keyframes */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

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

        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }
          100% {
            background-position: 468px 0;
          }
        }

        /* Animation Classes */
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        /* Skeleton Loading Styles */
        .skeleton-title {
          height: 38px;
          width: 200px;
          background: #e0e0e0;
          border-radius: 4px;
          margin-bottom: 24px;
          overflow: hidden;
          position: relative;
        }

        .skeleton-search {
          height: 40px;
          width: 100%;
          background: #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
        }

        .skeleton-filter {
          height: 32px;
          width: 100%;
          background: #e0e0e0;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
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
          background: linear-gradient(
            to right,
            #f0f0f0 8%,
            #e0e0e0 18%,
            #f0f0f0 33%
          );
          background-size: 800px 104px;
          animation: shimmer 1.5s infinite linear;
        }

        .skeleton-content {
          padding: 16px;
        }

        .skeleton-line {
          height: 16px;
          margin-bottom: 12px;
          border-radius: 4px;
          background: linear-gradient(
            to right,
            #f0f0f0 8%,
            #e0e0e0 18%,
            #f0f0f0 33%
          );
          background-size: 800px 104px;
          animation: shimmer 1.5s infinite linear;
        }

        .skeleton-line--title {
          width: 70%;
          height: 20px;
          margin-bottom: 16px;
        }

        .skeleton-line--text {
          width: 90%;
        }

        .skeleton-line--price {
          width: 50%;
          height: 18px;
          margin-top: 8px;
        }

        /* Shimmer effect for all skeletons */
        .skeleton-title:after,
        .skeleton-search:after,
        .skeleton-filter:after,
        .skeleton-image:after,
        .skeleton-line:after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: linear-gradient(
            to right,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.8) 50%,
            rgba(255,255,255,0) 100%
          );
          animation: shimmer 2s infinite;
        }

        /* Updated color scheme */
        .gold-search-btn .ant-btn-primary {
          background-color: #D4AF37 !important;
          border-color: #D4AF37 !important;
          color: #fff !important;
        }

        .gold-search-btn .ant-btn-primary:hover,
        .gold-search-btn .ant-btn-primary:focus {
          background-color: #000 !important;
          border-color: #000 !important;
          color: #D4AF37 !important;
        }

        .gold-search-btn .ant-input:hover,
        .gold-search-btn .ant-input:focus {
          border-color: #D4AF37;
        }

        .gold-search-btn .ant-input-affix-wrapper-focused {
          border-color: #D4AF37;
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
        }

        .gold-search-btn .ant-input-affix-wrapper:hover {
            border-color: #D4AF37 !important;
            box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
          }


        .gold-card.ant-card-hoverable:hover {
          border-color: #D4AF37 !important;
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3) !important;
          transform: translateY(-4px);
        }


        /* Select dropdown styling */
        .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
          border-color: #D4AF37 !important;
        }

        .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
          border-color: #D4AF37 !important;
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
        }

        .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
          background-color: rgba(212, 175, 55, 0.1) !important;
        }

        .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
          background-color: rgba(212, 175, 55, 0.05) !important;
        }

        .ant-select-item-option:hover {
          background-color: #000 !important;
          color: #D4AF37 !important;
        }
      `}</style>
    </div>
  );
}