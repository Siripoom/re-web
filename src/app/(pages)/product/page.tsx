"use client";

import Image from "next/image";
import Link from "next/link";
import { Input, Select, Typography, Row, Col, Card, Button, Tag } from "antd";
import { usePropertyContext } from "../../../components/contexts/PropertyContext";
import { useLanguage } from "../../../components/contexts/LanguageContext";
import en from "../../../components/locales/en";
import th from "../../../components/locales/th";
import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const { Title } = Typography;
const { Option } = Select;

const translations = { en, th };

function SearchHandler({
  searchTerm,
  location,
  propertyType,
  propertyFormat,
  priceRange,
  propertyCode,
  setSearchTerm,
  setPropertyType,
  setPropertyFormat,
  setPriceRange,
  setLocation,
  setPropertyCode,
}: {
  searchTerm: string;
  location: string;
  propertyType: string;
  propertyFormat: string;
  priceRange: string;
  propertyCode: string;
  setSearchTerm: (term: string) => void;
  setPropertyType: (type: string) => void;
  setPropertyFormat: (format: string) => void;
  setPriceRange: (range: string) => void;
  setLocation: (loc: string) => void;
  setPropertyCode: (code: string) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    const typeQuery = searchParams.get("type");
    const propertyTypeQuery = searchParams.get("propertyType");
    const minPriceQuery = searchParams.get("minPrice");
    const maxPriceQuery = searchParams.get("maxPrice");
    const locationQuery = searchParams.get("location");
    const propertyCodeQuery = searchParams.get("propertyCode");

    if (searchQuery !== null && searchQuery !== searchTerm) {
      setSearchTerm(decodeURIComponent(searchQuery));
    }
    if (typeQuery !== null && typeQuery !== propertyFormat) {
      setPropertyFormat(typeQuery);
    }
    if (propertyTypeQuery !== null && propertyTypeQuery !== propertyType) {
      setPropertyType(propertyTypeQuery);
    }
    if (locationQuery !== null && locationQuery !== location) {
      setLocation(locationQuery);
    }
    if (propertyCodeQuery !== null && propertyCodeQuery !== propertyCode) {
      setPropertyCode(propertyCodeQuery);
    }
    if (minPriceQuery && maxPriceQuery) {
      const max = parseInt(maxPriceQuery);
      let range = "";

      if (max <= 10000000) {
        range = "0-10";
      } else if (max <= 20000000) {
        range = "10-20";
      } else {
        range = "20+";
      }

      if (range !== priceRange) {
        setPriceRange(range);
      }
    }
  }, [searchParams]);

  return null;
}

function SearchFallback() {
  return <div style={{ height: "1px" }} />;
}

function getPropertyTypeTag(type: string) {
  const lowerType = type.toLowerCase();
  if (lowerType === "rent") {
    return { color: "#52c41a", text: "FOR RENT" };
  } else if (lowerType === "sell" || lowerType === "sale") {
    return { color: "#1890ff", text: "FOR SALE" };
  }
  return { color: "#d4af37", text: type.toUpperCase() };
}

function PropertySearchContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertyFormat, setPropertyFormat] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [propertyCode, setPropertyCode] = useState("");
  const { allProperties: properties, loading } = usePropertyContext();
  const { language } = useLanguage();
  const t = (key: keyof typeof en) => translations[language][key];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateURL = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchTerm) {
      params.set("search", encodeURIComponent(searchTerm));
    } else {
      params.delete("search");
    }
    
    if (propertyFormat) {
      params.set("type", propertyFormat);
    } else {
      params.delete("type");
    }
    
    if (propertyType) {
      params.set("propertyType", propertyType);
    } else {
      params.delete("propertyType");
    }
    
    if (location) {
      params.set("location", location);
    } else {
      params.delete("location");
    }
    
    if (propertyCode) {
      params.set("propertyCode", propertyCode);
    } else {
      params.delete("propertyCode");
    }
    
    if (priceRange) {
      if (priceRange === "0-10") {
        params.set("minPrice", "0");
        params.set("maxPrice", "10000000");
      } else if (priceRange === "10-20") {
        params.set("minPrice", "10000000");
        params.set("maxPrice", "20000000");
      } else if (priceRange === "20+") {
        params.set("minPrice", "20000000");
        params.set("maxPrice", "100000000");
      }
    } else {
      params.delete("minPrice");
      params.delete("maxPrice");
    }

    if (params.toString() !== searchParams.toString()) {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchTerm, location, propertyType, propertyFormat, priceRange, propertyCode, pathname, router, searchParams]);

  useEffect(() => {
    updateURL();
  }, [searchTerm, location, propertyType, propertyFormat, priceRange, propertyCode, updateURL]);

  const handleClearFilter = (type: string) => {
    switch (type) {
      case "location":
        setLocation("");
        break;
      case "propertyType":
        setPropertyType("");
        break;
      case "propertyFormat":
        setPropertyFormat("");
        break;
      case "priceRange":
        setPriceRange("");
        break;
      case "propertyCode":
        setPropertyCode("");
        break;
      default:
        break;
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property.property_code && property.property_code.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPropertyCode = 
      !propertyCode || 
      (property.property_code && property.property_code.toLowerCase().includes(propertyCode.toLowerCase()));

    return (
      matchesSearch &&
      matchesPropertyCode &&
      (!location || property.location === location) &&
      (!propertyType || property.property_type === propertyType) &&
      (!propertyFormat ||
        String(property.type || "").toLowerCase() ===
          String(propertyFormat).toLowerCase()) &&
      (!priceRange ||
        (priceRange === "0-10" && property.price < 10000000) ||
        (priceRange === "10-20" &&
          property.price >= 10000000 &&
          property.price < 20000000) ||
        (priceRange === "20+" && property.price >= 20000000))
    );
  });

  const locations = Array.from(
    new Set(
      properties
        .map((p) => p.location)
        .filter((loc) => loc !== undefined && loc !== null)
    )
  );
  const propertyTypes = Array.from(
    new Set(
      properties
        .map((p) => p.property_type)
        .filter((type) => type !== undefined && type !== null)
    )
  );
  const propertyFormats = Array.from(
    new Set(
      properties
        .map((p) => p.type)
        .filter((format) => format !== undefined && format !== null)
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Header Image */}
      <div className="relative h-64 md:h-96">
        <Image
          src="/bg.jpg"
          alt="Property Search"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white">
          <Title
            level={1}
            className="!text-white !text-3xl md:!text-5xl text-center mb-4"
          >
            {t("product") || "Properties"}
          </Title>
          <p className="text-xl md:text-3xl text-center max-w-2xl px-4">
            {language === "th"
              ? "ค้นหาอสังหาริมทรัพย์ที่เหมาะกับคุณ"
              : "Find the perfect property for you"}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 -mt-16 relative z-20">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Suspense fallback={<SearchFallback />}>
            <SearchHandler
              searchTerm={searchTerm}
              location={location}
              propertyType={propertyType}
              propertyFormat={propertyFormat}
              priceRange={priceRange}
              propertyCode={propertyCode}
              setSearchTerm={setSearchTerm}
              setPropertyType={setPropertyType}
              setPropertyFormat={setPropertyFormat}
              setPriceRange={setPriceRange}
              setLocation={setLocation}
              setPropertyCode={setPropertyCode}
            />
          </Suspense>

          {loading ? (
            <div className="skeleton-search mb-6"></div>
          ) : (
            <Input.Search
              placeholder={t("search") || "Search by name or property code"}
              enterButton={
                <Button
                  type="primary"
                  className="gold-search-button"
                  style={{ fontSize: "18px", height: "42px" }}
                >
                  {t("searchbtn") || "Search"}
                </Button>
              }
              allowClear
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={updateURL}
              className="mb-6 animate-fadeIn gold-search-btn"
              style={{ fontSize: "18px" }}
            />
          )}

          <Row gutter={[16, 16]} className="mb-8">
            {loading ? (
              <>
                {[1, 2, 3, 4, 5].map((item) => (
                  <Col xs={24} sm={12} md={6} key={item}>
                    <div className="skeleton-filter"></div>
                  </Col>
                ))}
              </>
            ) : (
              <>
                <Col xs={24} sm={12} md={6} className="animate-fadeIn delay-100">
                  <Select
                    placeholder={t("location") || "Location"}
                    value={location || undefined}
                    onChange={(value) => {
                      setLocation(value || "");
                      if (value === undefined) handleClearFilter("location");
                    }}
                    style={{ width: "100%", fontSize: "18px" }}
                    allowClear
                    dropdownStyle={{ fontSize: "16px" }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      const label = typeof option?.children === "string"
                        ? option.children
                        : String(option?.children ?? "");
                      return label.toLowerCase().includes(input.toLowerCase());
                    }}
                  >
                    {locations.map((loc) => (
                      <Option key={loc} value={loc} style={{ fontSize: "16px" }}>
                        {loc}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={6} className="animate-fadeIn delay-200">
                  <Select
                    placeholder={t("propertyType") || "Property Type"}
                    value={propertyType || undefined}
                    onChange={(value) => {
                      setPropertyType(value || "");
                      if (value === undefined) handleClearFilter("propertyType");
                    }}
                    style={{ width: "100%", fontSize: "18px" }}
                    allowClear
                    dropdownStyle={{ fontSize: "16px" }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      const label = typeof option?.children === "string"
                        ? option.children
                        : String(option?.children ?? "");
                      return label.toLowerCase().includes(input.toLowerCase());
                    }}
                  >
                    {propertyTypes.map((type) => (
                      <Option key={type} value={type} style={{ fontSize: "16px" }}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={6} className="animate-fadeIn delay-300">
                  <Select
                    placeholder={t("propertyFormat") || "Property Format"}
                    value={propertyFormat || undefined}
                    onChange={(value) => {
                      setPropertyFormat(value || "");
                      if (value === undefined) handleClearFilter("propertyFormat");
                    }}
                    style={{ width: "100%", fontSize: "18px" }}
                    allowClear
                    dropdownStyle={{ fontSize: "16px" }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      const label = typeof option?.children === "string"
                        ? option.children
                        : String(option?.children ?? "");
                      return label.toLowerCase().includes(input.toLowerCase());
                    }}
                  >
                    {propertyFormats.map((format) => (
                      <Option key={format} value={format} style={{ fontSize: "16px" }}>
                        {format}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={6} className="animate-fadeIn delay-400">
                  <Select
                    placeholder={t("priceRange") || "Price Range"}
                    value={priceRange || undefined}
                    onChange={(value) => {
                      setPriceRange(value || "");
                      if (value === undefined) handleClearFilter("priceRange");
                    }}
                    style={{ width: "100%", fontSize: "18px" }}
                    allowClear
                    dropdownStyle={{ fontSize: "16px" }}
                  >
                    <Option value="0-10" style={{ fontSize: "16px" }}>
                      0 - 10M
                    </Option>
                    <Option value="10-20" style={{ fontSize: "16px" }}>
                      10M - 20M
                    </Option>
                    <Option value="20+" style={{ fontSize: "16px" }}>
                      20M+
                    </Option>
                  </Select>
                </Col>
              </>
            )}
          </Row>
        </div>

        {/* Property Listings */}
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
            <Row gutter={[16, 16]} className="!flex !flex-wrap">
              {filteredProperties.map((property, index) => {
                const primaryImage =
                  property.images?.find((img) => img.is_primary)?.image_url ||
                  property.images?.[0]?.image_url ||
                  "/placeholder-property.jpg";

                const typeTag = getPropertyTypeTag(property.type);

                return (
                  <Col
                    xs={24}
                    sm={12}
                    md={8}
                    key={property.id}
                    className="animate-fadeInUp flex"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Link
                      href={`/property/${property.id}`}
                      className="hover:no-underline flex-1"
                    >
                      <Card
                        hoverable
                        className="transition-all h-full duration-300 hover:shadow-lg hover:-translate-y-1 gold-card flex flex-col"
                        cover={
                          <div className="h-[220px] relative overflow-hidden">
                            <Image
                              src={primaryImage}
                              alt={property.name}
                              fill
                              className="object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <Tag
                              color={typeTag.color}
                              className="!absolute !top-4 !right-4 !font-bold !px-3 !py-1"
                              style={{
                                color: "white",
                                fontSize: "15px",
                                fontWeight: "bold",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                zIndex: 1,
                              }}
                            >
                              {typeTag.text}
                            </Tag>
                          </div>
                        }
                        bodyStyle={{ flex: 1 }}
                      >
                        <div className="flex flex-col h-full">
                          <h3 className="text-xl font-semibold mb-2">
                            {property.name}
                          </h3>
                          <div className="text-gray-600 mb-4 flex-grow">
                            <p className="mb-1 text-lg">
                              📌 {property.location}
                            </p>
                            <p className="mb-1 text-lg">
                              🛏 {property.bedrooms} | 🚿 {property.bathrooms}
                            </p>
                            <p className="mb-1 text-lg">
                              🏠 {property.property_type} | {property.land_area_sqm} sqft
                            </p>
                            {property.property_code && (
                              <p className="mb-1 text-lg">
                                #️⃣ {property.property_code}
                              </p>
                            )}
                          </div>
                          <div className="text-[#D4AF37] text-xl font-semibold mt-auto">
                            {property.price.toLocaleString("en-US")} THB
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </Col>
                );
              })}
            </Row>
          )}

          {!loading && filteredProperties.length === 0 && (
            <div className="text-center py-12 animate-fadeIn">
              <h3
                className="text-2xl font-medium text-gray-600"
                style={{ fontSize: "24px" }}
              >
                {t("noMatch")}
              </h3>
              <p className="text-gray-500 mt-3" style={{ fontSize: "18px" }}>
                {t("tryAdjustFilters")}
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
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

        .delay-500 {
          animation-delay: 0.5s;
        }

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
          height: 220px;
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
          height: 24px;
          margin-bottom: 16px;
        }

        .skeleton-line--text {
          width: 90%;
          height: 18px;
        }

        .skeleton-line--price {
          width: 50%;
          height: 20px;
          margin-top: 8px;
        }

        .skeleton-title:after,
        .skeleton-search:after,
        .skeleton-filter:after,
        .skeleton-image:after,
        .skeleton-line:after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.8) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 2s infinite;
        }

        .gold-search-btn .ant-btn-primary {
          background-color: #d4af37 !important;
          border-color: #d4af37 !important;
          color: #fff !important;
        }

        .gold-search-btn .ant-btn-primary:hover,
        .gold-search-btn .ant-btn-primary:focus {
          background-color: #000 !important;
          border-color: #000 !important;
          color: #d4af37 !important;
        }

        .gold-search-btn .ant-input:hover,
        .gold-search-btn .ant-input:focus {
          border-color: #d4af37;
        }

        .gold-search-btn .ant-input-affix-wrapper-focused {
          border-color: #d4af37;
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
        }

        .gold-search-btn .ant-input-affix-wrapper:hover {
          border-color: #d4af37 !important;
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
        }

        .gold-card.ant-card-hoverable:hover {
          border-color: #d4af37 !important;
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3) !important;
          transform: translateY(-4px);
        }

        .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
          border-color: #d4af37 !important;
        }

        .ant-select-focused:not(.ant-select-disabled).ant-select:not(
            .ant-select-customize-input
          )
          .ant-select-selector {
          border-color: #d4af37 !important;
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
          color: #d4af37 !important;
        }

        .ant-tag {
          margin: 0;
        }

        @media (max-width: 768px) {
          .ant-typography {
            font-size: 20px !important;
          }
          h2.ant-typography {
            font-size: 24px !important;
          }
          .ant-input,
          .ant-select-selector,
          .ant-btn {
            font-size: 16px !important;
          }
          .ant-card-meta-title {
            font-size: 18px !important;
          }
          .ant-card-meta-description {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function PropertySearch() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="skeleton-title mb-6"></div>
            <div className="skeleton-search mb-6"></div>
            <Row gutter={[16, 16]} className="mb-8">
              {[1, 2, 3, 4, 5].map((item) => (
                <Col xs={24} sm={12} md={6} key={item}>
                  <div className="skeleton-filter"></div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      }
    >
      <PropertySearchContent />
    </Suspense>
  );
}