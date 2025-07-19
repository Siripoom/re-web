"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Input,
  Button,
  Typography,
  Row,
  Col,
  Card,
  Spin,
  Alert,
  Tag,
  Divider,
  message,
  Select,
  Modal,
  Form,
  Slider,
} from "antd";
import {
  EnvironmentOutlined,
  StarFilled,
  SearchOutlined,
  FilterOutlined,
  LeftOutlined,
  RightOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useLanguage } from "../../../components/contexts/LanguageContext";
import { useState, useEffect, useCallback, useRef, JSX } from "react";
import { useRouter } from "next/navigation";
import { PropertyService } from "@/services/propertyService";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

interface PropertyImage {
  image_url: string;
  is_primary: boolean;
}

interface Property {
  id: string;
  name: string;
  type: string;
  location?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: number;
  images: PropertyImage[];
  address: string;
  description?: string;
  kitchens: number;
  living_rooms: number;
  car_parks: number;
  property_type: "Villa" | "Condo" | "House" | "Apartment" | "Land";
  area_sqm?: number;
  land_area_sqm?: number;
  status: "Available" | "Sold" | "Rented";
  featured: boolean;
  created_at: string;
  updated_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  amenities: any;
}

interface PopularArea {
  name: string;
  image: string;
  count: number;
}

interface PropertyType {
  name: string;
  icon: JSX.Element;
  count: number;
  value: string;
}

export default function Home() {
  const { language } = useLanguage();
  const router = useRouter();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [popularAreas, setPopularAreas] = useState<PopularArea[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [form] = Form.useForm();
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const propertiesByLocationRef = useRef<Record<string, Property[]>>({});
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const popularAreasRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const [searchParams, setSearchParams] = useState({
    searchQuery: "",
    transactionType: "sell",
    filters: {
      propertyType: "",
      bedrooms: "",
      bathrooms: "",
      minPrice: "",
      maxPrice: "",
      area: "",
    },
  });

  // ตรวจสอบว่าเป็น mobile หรือไม่
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // ตรวจสอบครั้งแรกเมื่อโหลดหน้า
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Number of properties to show per slide
  const propertiesPerSlide = isMobile ? 1 : 3;
  const areasPerSlide = isMobile ? 1 : 4;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [properties, stats, allProperties] = await Promise.all([
        PropertyService.getFeaturedProperties(),
        PropertyService.getPropertyStats(),
        PropertyService.getAllProperties(),
      ]);

      const formattedProperties: Property[] = properties.map((property) => ({
        ...property,
        location: property.location || "",
        images:
          property.images && Array.isArray(property.images)
            ? property.images
            : [],
      }));
      setFeaturedProperties(formattedProperties);

      // Group properties by location
      const locationMap: Record<string, Property[]> = {};
      allProperties.forEach((property) => {
        if (!property.location) return;
        if (!locationMap[property.location]) {
          locationMap[property.location] = [];
        }
        locationMap[property.location].push({
          ...property,
          images:
            property.images && Array.isArray(property.images)
              ? property.images
              : [],
        });
      });
      propertiesByLocationRef.current = locationMap;

      if (stats?.locationStats) {
        const areas = Object.entries(stats.locationStats)
          .filter(([name]) => name && name !== "null" && name !== "undefined")
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, count]) => {
            // Get first property image from this location
            const locationProperties = locationMap[name] || [];
            const firstProperty = locationProperties[0];
            const image =
              firstProperty?.images?.[0]?.image_url || "/default-property.jpg";

            return {
              name,
              image,
              count: count as number,
            };
          });

        setPopularAreas(
          areas.length > 0
            ? areas
            : [
                { name: "Patong", image: "/header.jpg", count: 24 },
                { name: "Kamala", image: "/header1.jpeg", count: 18 },
                { name: "Rawai", image: "/header1.jpeg", count: 12 },
                { name: "Kata", image: "/header1.jpeg", count: 15 },
              ]
        );
      }
      const types: PropertyType[] = [
  {
    name: language === "th" ? "วิลล่า" : "Villa",
    icon: (
      <div className="border-6 border-[#FFB823] rounded-full p-2 shadow-lg hover:scale-110 transition duration-300 ease-in-out bg-[#443627]">
        <Image
          src="/villa.png"
          alt="Villa"
          width={48}
          height={40}
          className="w-12 h-10"
        />
      </div>
    ),
    count: stats?.propertyTypeStats?.["Villa"] || 0,
    value: "Villa",
  },
  {
    name: language === "th" ? "คอนโดมิเนียม" : "Condominium",
    icon: (
      <div className="border-4 border-[#FFB823] rounded-full p-2 shadow-lg hover:scale-110 transition duration-300 ease-in-out bg-[#443627]">
        <Image
          src="/condominium.png"
          alt="Condominium"
          width={36}
          height={36}
          className="w-9 h-9"
        />
      </div>
    ),
    count: stats?.propertyTypeStats?.["Condo"] || 0,
    value: "Condo",
  },
  {
    name: language === "th" ? "บ้าน" : "House",
    icon: (
      <div className="border-5 border-[#FFB823] rounded-full p-2 shadow-lg hover:scale-110 transition duration-300 ease-in-out bg-[#443627]">
        <Image
          src="/home.png"
          alt="House"
          width={44}
          height={40}
          className="w-11 h-10"
        />
      </div>
    ),
    count: stats?.propertyTypeStats?.["House"] || 0,
    value: "House",
  },
  {
    name: language === "th" ? "อพาร์ตเมนต์" : "Apartment",
    icon: (
      <div className="border-4 border-[#FFB823] rounded-full p-2 shadow-lg hover:scale-110 transition duration-300 ease-in-out bg-[#443627]">
        <Image
          src="/apartments.png"
          alt="Apartments"
          width={30}
          height={46}
          className="w-9 h-9"
        />
      </div>
    ),
    count: stats?.propertyTypeStats?.["Apartment"] || 0,
    value: "Apartment",
  },
  {
    name: language === "th" ? "ที่ดิน" : "Land",
    icon: (
      <div className="border-4 border-[#FFB823] rounded-full p-2 shadow-lg hover:scale-110 transition duration-300 ease-in-out bg-[#443627]">
        <Image
          src="/land.png"
          alt="Land"
          width={36}
          height={36}
          className="w-9 h-9"
        />
      </div>
    ),
    count: stats?.propertyTypeStats?.["Land"] || 0,
    value: "Land",
  },
];

      setPropertyTypes(types);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
      message.error(
        language === "th" ? "ไม่สามารถโหลดข้อมูลได้" : "Failed to load data"
      );
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto slide transition effect for featured properties
  const currentSlideRef = useRef(currentSlide);

  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  useEffect(() => {
    if (featuredProperties.length <= propertiesPerSlide) return;

    const interval = setInterval(() => {
      const nextIndex = (currentSlideRef.current + 1) % 
        Math.ceil(featuredProperties.length / propertiesPerSlide);
      
      setCurrentSlide(nextIndex);
      scrollToSlide(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredProperties.length, propertiesPerSlide]);

  // Auto slide transition effect for popular areas
  const currentAreaIndexRef = useRef(currentAreaIndex);

  useEffect(() => {
    currentAreaIndexRef.current = currentAreaIndex;
  }, [currentAreaIndex]);

  useEffect(() => {
    if (popularAreas.length <= areasPerSlide) return;

    const interval = setInterval(() => {
      const nextIndex = (currentAreaIndexRef.current + 1) % 
        Math.ceil(popularAreas.length / areasPerSlide);
      
      setCurrentAreaIndex(nextIndex);
      scrollToAreaSlide(nextIndex);
    }, 6000);

    return () => clearInterval(interval);
  }, [popularAreas.length, areasPerSlide]);

  const showFilterModal = () => {
    form.setFieldsValue({
      propertyType: searchParams.filters.propertyType,
      bedrooms: searchParams.filters.bedrooms,
      bathrooms: searchParams.filters.bathrooms,
      priceRange: [
        searchParams.filters.minPrice
          ? parseInt(searchParams.filters.minPrice)
          : 0,
        searchParams.filters.maxPrice
          ? parseInt(searchParams.filters.maxPrice)
          : 100000000,
      ],
      area: searchParams.filters.area,
    });
    setIsFilterModalVisible(true);
  };

  const handleFilterOk = () => {
    form.validateFields().then((values) => {
      const filters = {
        propertyType: values.propertyType || "",
        bedrooms: values.bedrooms || "",
        bathrooms: values.bathrooms || "",
        minPrice: values.priceRange ? values.priceRange[0].toString() : "",
        maxPrice: values.priceRange ? values.priceRange[1].toString() : "",
        area: values.area || "",
      };

      const queryParams = new URLSearchParams();
      if (searchParams.searchQuery) {
        queryParams.append("search", searchParams.searchQuery);
      }
      queryParams.append("type", searchParams.transactionType);

      if (filters.propertyType)
        queryParams.append("propertyType", filters.propertyType);
      if (filters.bedrooms) queryParams.append("bedrooms", filters.bedrooms);
      if (filters.bathrooms) queryParams.append("bathrooms", filters.bathrooms);
      if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
      if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
      if (filters.area) queryParams.append("area", filters.area);

      setSearchParams((prev) => ({ ...prev, filters }));
      setIsFilterModalVisible(false);
      router.push(`/product?${queryParams.toString()}`);
    });
  };

  const handleFilterCancel = () => {
    setIsFilterModalVisible(false);
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();

    if (searchParams.searchQuery) {
      queryParams.append("search", searchParams.searchQuery);
    }

    queryParams.append("type", searchParams.transactionType);

    if (searchParams.filters.propertyType) {
      queryParams.append("propertyType", searchParams.filters.propertyType);
    }

    if (searchParams.filters.bedrooms) {
      queryParams.append("bedrooms", searchParams.filters.bedrooms);
    }

    if (searchParams.filters.bathrooms) {
      queryParams.append("bathrooms", searchParams.filters.bathrooms);
    }

    if (searchParams.filters.minPrice) {
      queryParams.append("minPrice", searchParams.filters.minPrice);
    }

    if (searchParams.filters.maxPrice) {
      queryParams.append("maxPrice", searchParams.filters.maxPrice);
    }

    if (searchParams.filters.area) {
      queryParams.append("area", searchParams.filters.area);
    }

    router.push(`/product?${queryParams.toString()}`);
  };

  const getPropertyTypeTag = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType === "rent") {
      return { color: "#52c41a", text: "FOR RENT" };
    } else if (lowerType === "sell" || lowerType === "sale") {
      return { color: "#1890ff", text: "FOR SALE" };
    }
    return { color: "#d4af37", text: type.toUpperCase() };
  };

  const truncateName = (name: string, maxLength: number = 20) => {
    return name.length > maxLength
      ? `${name.substring(0, maxLength)}...`
      : name;
  };

  const scrollToSlide = useCallback((index: number) => {
    const container = carouselRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * index;
      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  const nextSlide = useCallback(() => {
    const nextIndex = (currentSlide + 1) % 
      Math.ceil(featuredProperties.length / propertiesPerSlide);
    setCurrentSlide(nextIndex);
    scrollToSlide(nextIndex);
  }, [currentSlide, featuredProperties.length, propertiesPerSlide, scrollToSlide]);

  const prevSlide = useCallback(() => {
    const prevIndex = (currentSlide - 1 + 
      Math.ceil(featuredProperties.length / propertiesPerSlide)) % 
      Math.ceil(featuredProperties.length / propertiesPerSlide);
    setCurrentSlide(prevIndex);
    scrollToSlide(prevIndex);
  }, [currentSlide, featuredProperties.length, propertiesPerSlide, scrollToSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    scrollToSlide(index);
  };

  const scrollToAreaSlide = useCallback((index: number) => {
    const container = popularAreasRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * index;
      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  const nextArea = useCallback(() => {
    const nextIndex = (currentAreaIndex + 1) % 
      Math.ceil(popularAreas.length / areasPerSlide);
    setCurrentAreaIndex(nextIndex);
    scrollToAreaSlide(nextIndex);
  }, [currentAreaIndex, popularAreas.length, areasPerSlide, scrollToAreaSlide]);

  const prevArea = useCallback(() => {
    const prevIndex = (currentAreaIndex - 1 + 
      Math.ceil(popularAreas.length / areasPerSlide)) % 
      Math.ceil(popularAreas.length / areasPerSlide);
    setCurrentAreaIndex(prevIndex);
    scrollToAreaSlide(prevIndex);
  }, [currentAreaIndex, popularAreas.length, areasPerSlide, scrollToAreaSlide]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert
          message={language === "th" ? "เกิดข้อผิดพลาด" : "Error"}
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-screen max-h-[800px]">
        <Image
          src="/bg.jpg"
          alt="Luxury Villa"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black opacity-30"></div>

        <div className="relative z-10 h-full flex flex-col justify-center">
          <div className="container mx-auto px-6 text-white">
            <div className="max-w-5xl mx-auto">
              <Title
                level={1}
                className="!text-white !text-5xl md:!text-6xl font-serif"
              >
                {language === "th"
                  ? "ค้นหาวิลล่าในฝันของคุณที่ภูเก็ต"
                  : "Find your dream villa in Phuket"}
              </Title>

              <div className="flex items-center mb-8">
                <Divider className="!w-16 !min-w-0 !border-white !border-2 !m-0" />
                <Text className="!text-white !text-xl ml-4">
                  {language === "th"
                    ? "สำรวจอสังหาริมทรัพย์หรูเฉพาะของเราที่ภูเก็ตในทำเลที่เป็นที่ต้องการที่สุด"
                    : "Explore our exclusive collection of luxury properties in Phuket's most sought-after locations."}
                </Text>
              </div>
              <div className="flex mb-0 mx-auto w-full mobile-search-container ">
                <Button
                  type="primary"
                  className={`!h-18 !text-xl !px-20 !font-semibold !rounded-none !rounded-tl-lg ${
                    searchParams.transactionType === "sell"
                      ? "!bg-[#D4AF37] !border-[#D4AF37]"
                      : "!bg-white !text-gray-700 "
                  }`}
                  onClick={() =>
                    setSearchParams({
                      ...searchParams,
                      transactionType: "sell",
                    })
                  }
                >
                  {language === "th" ? "ขาย" : "Sell"}
                </Button>
                <Button
                  type="primary"
                  className={`!h-18 !text-xl !px-20 !font-semibold !rounded-none !rounded-tr-lg ${
                    searchParams.transactionType === "rent"
                      ? "!bg-[#D4AF37] !border-[#D4AF37]"
                      : "!bg-white !text-gray-700 "
                  }`}
                  onClick={() =>
                    setSearchParams({
                      ...searchParams,
                      transactionType: "rent",
                    })
                  }
                >
                  {language === "th" ? "เช่า" : "Rent"}
                </Button>
              </div>
              <div className="bg-white bg-opacity-100 p-6 !rounded-r-none !rounded-tr-lg !rounded-br-lg !rounded-bl-lg shadow-md mt-0">
                <div className="flex flex-col md:flex-row gap-4 items-center w-full">
                  <Input
                    placeholder={
                      language === "th"
                        ? "ค้นหาด้วยชื่อโครงการหรือสถานที่"
                        : "Search your property"
                    }
                    size="large"
                    className="flex-grow !h-14 text-lg !rounded-lg hover:!border-[#D4AF37] focus:!border-[#D4AF37]"
                    prefix={<SearchOutlined className="text-gray-400" />}
                    value={searchParams.searchQuery}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        searchQuery: e.target.value,
                      })
                    }
                    onPressEnter={handleSearch}
                  />

                  <Button
                    size="large"
                    icon={<FilterOutlined />}
                    className="!h-14 !text-lg !rounded-lg hover:!border-[#D4AF37] hover:!text-[#D4AF37]"
                    onClick={showFilterModal}
                  >
                    {language === "th" ? "ตัวกรอง" : "Filter"}
                  </Button>

                  <Button
                    type="primary"
                    size="large"
                    className="!h-14 !bg-[#D4AF37] !border-[#D4AF37] !text-white !text-lg !rounded-lg hover:!bg-[#c9a227] hover:!border-[#c9a227]"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                  >
                    {language === "th" ? "ค้นหา" : "Search"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <Modal
        title={language === "th" ? "ตัวกรองค้นหา" : "Search Filters"}
        open={isFilterModalVisible}
        onOk={handleFilterOk}
        onCancel={handleFilterCancel}
        width={800}
        footer={[
          <Button key="reset" onClick={() => form.resetFields()}>
            {language === "th" ? "รีเซ็ต" : "Reset"}
          </Button>,
          <Button key="cancel" onClick={handleFilterCancel}>
            {language === "th" ? "ยกเลิก" : "Cancel"}
          </Button>,
          <Button
            key="search"
            type="primary"
            onClick={handleFilterOk}
            className="!bg-[#D4AF37] !border-[#D4AF37] hover:!bg-[#c9a227] hover:!border-[#c9a227]"
          >
            {language === "th" ? "ค้นหา" : "Search"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="propertyType"
                label={
                  language === "th" ? "ประเภทอสังหาริมทรัพย์" : "Property Type"
                }
              >
                <Select
                  placeholder={
                    language === "th" ? "เลือกประเภท" : "Select type"
                  }
                  className="hover:!border-[#D4AF37]"
                >
                  <Option value="Villa">
                    {language === "th" ? "วิลล่า" : "Villa"}
                  </Option>
                  <Option value="Condo">
                    {language === "th" ? "คอนโดมิเนียม" : "Condominium"}
                  </Option>
                  <Option value="House">
                    {language === "th" ? "บ้านเดี่ยว" : "House"}
                  </Option>
                  <Option value="Apartment">
                    {language === "th" ? "อพาร์ตเมนต์" : "Apartment"}
                  </Option>
                  <Option value="Land">
                    {language === "th" ? "ที่ดิน" : "Land"}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="bedrooms"
                label={language === "th" ? "ห้องนอน" : "Bedrooms"}
              >
                <Select
                  placeholder={language === "th" ? "ทั้งหมด" : "Any"}
                  className="hover:!border-[#D4AF37]"
                >
                  <Option value="1">1+</Option>
                  <Option value="2">2+</Option>
                  <Option value="3">3+</Option>
                  <Option value="4">4+</Option>
                  <Option value="5">5+</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="bathrooms"
                label={language === "th" ? "ห้องน้ำ" : "Bathrooms"}
              >
                <Select
                  placeholder={language === "th" ? "ทั้งหมด" : "Any"}
                  className="hover:!border-[#D4AF37]"
                >
                  <Option value="1">1+</Option>
                  <Option value="2">2+</Option>
                  <Option value="3">3+</Option>
                  <Option value="4">4+</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="priceRange"
            label={language === "th" ? "ช่วงราคา (THB)" : "Price Range (THB)"}
          >
            <Slider
              range
              min={0}
              max={100000000}
              step={1000000}
              trackStyle={[{ backgroundColor: "#D4AF37" }]}
              handleStyle={[{ borderColor: "#D4AF37" }]}
              tipFormatter={(value) => `${(value || 0).toLocaleString()} THB`}
            />
          </Form.Item>

          <Form.Item
            name="area"
            label={language === "th" ? "พื้นที่ (ตร.ม.)" : "Area (sqm)"}
          >
            <Select
              placeholder={language === "th" ? "เลือกพื้นที่" : "Select area"}
              className="hover:!border-[#D4AF37]"
            >
              <Option value="0-100">0-100 ตร.ม.</Option>
              <Option value="100-200">100-200 ตร.ม.</Option>
              <Option value="200-300">200-300 ตร.ม.</Option>
              <Option value="300+">300+ ตร.ม.</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Property Types Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Title level={2} className="!text-3xl !mb-4 font-serif">
              {language === "th" ? "ประเภทอสังหาริมทรัพย์" : "Property Types"}
            </Title>
            <Divider className="!w-16 !m-auto !border-[#D4AF37] !border-2" />
            <Paragraph className="!text-lg !mt-6 !text-gray-600 max-w-2xl mx-auto">
              {language === "th"
                ? "ค้นหาอสังหาริมทรัพย์ตามประเภทที่คุณสนใจ"
                : "Explore properties by types you're interested in"}
            </Paragraph>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <Spin size="large" indicator={<LoadingOutlined style={{ color: '#D4AF37' }} spin />} />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <Row gutter={[24, 24]} justify="center">
                {/* Row 1: 3 items */}
                <Row gutter={[24, 24]} className="w-full mb-6" justify="center">
                  {propertyTypes.slice(0, 3).map((type) => (
                    <Col xs={24} sm={12} md={8} key={type.name}>
                      <div
                        className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col items-center hover:border-[#D4AF37]"
                        onClick={() =>
                          router.push(`/product?propertyType=${type.value}`)
                        }
                      >
                        <div className="w-16 h-16 bg-[#D4AF37] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                          {type.icon}
                        </div>
                        <Title level={4} className="!mb-2">
                          {type.name}
                        </Title>
                        <Text className="!text-gray-600 mt-auto">
                          {type.count}{" "}
                          {language === "th" ? "รายการ" : "Properties"}
                        </Text>
                      </div>
                    </Col>
                  ))}
                </Row>

                {/* Row 2: 2 items */}
                <Row gutter={[24, 24]} className="w-full" justify="center">
                  {propertyTypes.slice(3, 5).map((type) => (
                    <Col xs={24} sm={12} md={8} key={type.name}>
                      <div
                        className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col items-center hover:border-[#D4AF37]"
                        onClick={() =>
                          router.push(`/product?propertyType=${type.value}`)
                        }
                      >
                        <div className="w-16 h-16 bg-[#D4AF37] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                          {type.icon}
                        </div>
                        <Title level={4} className="!mb-2">
                          {type.name}
                        </Title>
                        <Text className="!text-gray-600 mt-auto">
                          {type.count}{" "}
                          {language === "th" ? "รายการ" : "Properties"}
                        </Text>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Row>
            </div>
          )}
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Title level={2} className="!text-3xl !mb-4 font-serif">
              {language === "th" ? "คุณสมบัติเด่น" : "Featured Properties"}
            </Title>
            <Divider className="!w-16 !m-auto !border-[#D4AF37] !border-2" />
            <Paragraph className="!text-lg !mt-6 !text-gray-600 max-w-2xl mx-auto">
              {language === "th"
                ? "ค้นพบอสังหาริมทรัพย์ระดับพรีเมียมที่คัดสรรมาอย่างดีของเราในภูเก็ต"
                : "Discover our curated selection of premium properties in Phuket"}
            </Paragraph>
          </div>

          {loading ? (
            <div className="flex justify-center">
             <Spin size="large" indicator={<LoadingOutlined style={{ color: '#D4AF37' }} spin />} />
            </div>
          ) : (
            <>
              <div className="relative">
                <div
                  ref={carouselRef}
                  className="overflow-hidden relative w-full"
                  style={{ 
                    height: "500px",
                    scrollBehavior: "smooth",
                    scrollSnapType: "x mandatory"
                  }}
                >
                  <div 
                    className="flex"
                    style={{ 
                      width: `${Math.ceil(featuredProperties.length / propertiesPerSlide) * 100}%`,
                      transition: "transform 0.5s ease-in-out"
                    }}
                  >
                    {Array.from({
                      length: Math.ceil(featuredProperties.length / propertiesPerSlide),
                    }).map((_, slideIndex) => (
                      <div
                        key={slideIndex}
                        className="w-full flex-shrink-0 px-2"
                        style={{ 
                          scrollSnapAlign: "start",
                          width: `${100 / Math.ceil(featuredProperties.length / propertiesPerSlide)}%`
                        }}
                      >
                        <Row gutter={[24, 24]} justify={isMobile ? "center" : "start"}>
                          {featuredProperties
                            .slice(
                              slideIndex * propertiesPerSlide,
                              (slideIndex + 1) * propertiesPerSlide
                            )
                            .map((property) => {
                              const primaryImage =
                                property.images && property.images.length > 0
                                  ? property.images.find(
                                      (img) => img.is_primary
                                    )?.image_url ||
                                    property.images[0]?.image_url
                                  : "/default-property.jpg";
                              const typeTag = getPropertyTypeTag(property.type);

                              return (
                                <Col xs={24} sm={24} lg={8} key={property.id}>
                                  <Link href={`/property/${property.id}`}>
                                    <Card
                                      hoverable
                                      className="!border-none !rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 property-card"
                                      cover={
                                        <div className="h-64 relative overflow-hidden">
                                          {primaryImage ? (
                                            <Image
                                              src={primaryImage}
                                              alt={property.name}
                                              fill
                                              className="object-cover transition-transform duration-500 hover:scale-110"
                                              onError={(e) => {
                                                (
                                                  e.target as HTMLImageElement
                                                ).src = "/default-property.jpg";
                                              }}
                                            />
                                          ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                              <span>No Image</span>
                                            </div>
                                          )}
                                          <Tag
                                            color={typeTag.color}
                                            className="!absolute !top-4 !right-4 !font-bold !px-3 !py-1"
                                          >
                                            {typeTag.text}
                                          </Tag>
                                        </div>
                                      }
                                    >
                                      <div className="flex justify-between items-start ">
                                        <Title
                                          level={4}
                                          className="!m-0 !text-xl"
                                          ellipsis={{ tooltip: property.name }}
                                        >
                                          {truncateName(property.name)}
                                        </Title>
                                        <div className="flex items-center">
                                          <StarFilled className="text-[#D4AF37] mr-1" />
                                          <span>5.0</span>
                                        </div>
                                      </div>

                                      <div className="flex items-center text-gray-500 mb-3">
                                        <EnvironmentOutlined className="mr-2" />
                                        <Text
                                          ellipsis={{
                                            tooltip: property.location,
                                          }}
                                        >
                                          {property.location || "N/A"}
                                        </Text>
                                      </div>

                                      <div className="flex justify-between text-gray-700 mb-4">
                                        <div>
                                          <Text strong>
                                            🛏 {property.bedrooms}
                                          </Text>
                                          <Text className="mx-2">|</Text>
                                          <Text strong>
                                            🚿 {property.bathrooms}
                                          </Text>
                                        </div>
                                        <Text strong>
                                          🏠 {property.area} sqft
                                        </Text>
                                      </div>

                                      <Divider className="!my-3" />

                                      <div className="flex justify-between items-center">
                                        <Text
                                          strong
                                          className="!text-lg !text-[#D4AF37]"
                                        >
                                          {property.price.toLocaleString()} THB
                                        </Text>
                                        <Button
                                          type="primary"
                                          ghost
                                          className="!border-[#D4AF37] !text-[#D4AF37] hover:!bg-[#D4AF37] hover:!text-white"
                                        >
                                          {language === "th"
                                            ? "ดูรายละเอียด"
                                            : "View Details"}
                                        </Button>
                                      </div>
                                    </Card>
                                  </Link>
                                </Col>
                              );
                            })}
                        </Row>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Controls - Bottom Center */}
                <div className="flex justify-center items-center mt-8 gap-4">
                  <button
                    onClick={prevSlide}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-[#D4AF37] text-white shadow-lg hover:bg-[#c9a227] transition-all duration-300"
                  >
                    <LeftOutlined className="text-lg" />
                  </button>
                  
                  {/* Dots indicator */}
                  {featuredProperties.length > propertiesPerSlide && (
                    <div className="flex mx-4 gap-2">
                      {Array.from({
                        length: Math.ceil(
                          featuredProperties.length / propertiesPerSlide
                        ),
                      }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            currentSlide === index ? "bg-[#D4AF37] w-6" : "bg-gray-300"
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                  
                  <button
                    onClick={nextSlide}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-[#D4AF37] text-white shadow-lg hover:bg-[#c9a227] transition-all duration-300"
                  >
                    <RightOutlined className="text-lg" />
                  </button>
                </div>
              </div>

              <div className="text-center mt-12">
                <Button
                  type="primary"
                  size="large"
                  className="!bg-[#D4AF37] !border-[#D4AF37] !px-8 hover:!bg-[#c9a227] hover:!border-[#c9a227]"
                  onClick={() => router.push("/product")}
                >
                  {language === "th" ? "ดูทั้งหมด" : "View All Properties"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Popular Areas Section with Animation */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <Title level={2} className="!text-3xl !mb-2 font-serif">
                {language === "th" ? "พื้นที่ยอดนิยม" : "Prime Location"}
              </Title>
              <Paragraph className="!text-lg !text-gray-600">
                {language === "th"
                  ? "ค้นหาอสังหาริมทรัพย์ในพื้นที่ยอดนิยมของภูเก็ต"
                  : "Explore properties in Phuket's Prime Location"}
              </Paragraph>
            </div>
            <Button
              type="text"
              className="!text-[#D4AF37] !flex items-center !p-0"
              onClick={() => router.push("/product")}
            >
              {language === "th" ? "ดูทั้งหมด" : "View All"}{" "}
              <RightOutlined className="ml-1" />
            </Button>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <Spin size="large" indicator={<LoadingOutlined style={{ color: '#D4AF37' }} spin />} />
            </div>
          ) : (
            <div className="relative">
              <div
                ref={popularAreasRef}
                className="overflow-hidden relative w-full"
                style={{
                  scrollBehavior: "smooth",
                  scrollSnapType: "x mandatory"
                }}
              >
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    width: `${Math.ceil(popularAreas.length / areasPerSlide) * 100}%`,
                  }}
                >
                  {Array.from({
                    length: Math.ceil(popularAreas.length / areasPerSlide),
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="w-full flex-shrink-0 px-2"
                      style={{
                        scrollSnapAlign: "start",
                        width: `${100 / Math.ceil(popularAreas.length / areasPerSlide)}%`,
                      }}
                    >
                      <Row gutter={[24, 24]} justify={isMobile ? "center" : "start"}>
                        {popularAreas
                          .slice(index * areasPerSlide, (index + 1) * areasPerSlide)
                          .map((area) => (
                            <Col xs={24} sm={24} md={6} key={area.name}>
                              <Card
                                hoverable
                                className="!border-none !rounded-lg !p-0 !overflow-hidden !shadow-sm transition-all duration-300 hover:shadow-md area-card"
                                onClick={() =>
                                  router.push(`/product?location=${area.name}`)
                                }
                                cover={
                                  <div className="h-48 relative overflow-hidden">
                                    <Image
                                      src={area.image}
                                      alt={area.name}
                                      fill
                                      className="object-cover transition-transform duration-500 hover:scale-110"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                          "/default-property.jpg";
                                      }}
                                    />
                                  </div>
                                }
                              >
                                <div className="p-4">
                                  <Title level={4} className="!mb-1">
                                    {area.name}
                                  </Title>
                                  <Text className="!text-gray-600">
                                    {area.count}{" "}
                                    {language === "th"
                                      ? "คุณสมบัติ"
                                      : "Properties"}
                                  </Text>
                                </div>
                              </Card>
                            </Col>
                          ))}
                      </Row>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Controls - Moved to bottom */}
              {popularAreas.length > areasPerSlide && (
                <div className="flex justify-center items-center mt-8 gap-4">
                  <button
                    onClick={prevArea}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-[#D4AF37] text-white shadow-lg hover:bg-[#c9a227] transition-all duration-300"
                  >
                    <LeftOutlined className="text-lg" />
                  </button>
                  
                  {/* Dots indicator */}
                  <div className="flex mx-4 gap-2">
                    {Array.from({
                      length: Math.ceil(popularAreas.length / areasPerSlide),
                    }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentAreaIndex(index);
                          scrollToAreaSlide(index);
                        }}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          currentAreaIndex === index
                            ? "bg-[#D4AF37] w-6"
                            : "bg-gray-300"
                        }`}
                        aria-label={`Go to area group ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={nextArea}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-[#D4AF37] text-white shadow-lg hover:bg-[#c9a227] transition-all duration-300"
                  >
                    <RightOutlined className="text-lg" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}