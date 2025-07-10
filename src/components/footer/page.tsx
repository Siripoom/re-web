"use client";

import Image from "next/image";
import Link from "next/link";
import { Typography, Divider } from "antd";
import { useLanguage } from "../contexts/LanguageContext";
import en from "../locales/en";
import th from "../locales/th";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Title, Paragraph, Text } = Typography;
const translations = { en, th };

export default function Footer() {
  const { language } = useLanguage();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const t = translations[language];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img
                src="/logo2.jpg"
                alt="Logo"
                style={{
                  width: "122px",
                  height: "122px",
                  objectFit: "contain",
                }}
              />
              <Paragraph
                className="!text-gray-400"
                style={{ fontSize: "16px" }}
              >
                {language === "th"
                  ? "ผู้เชี่ยวชาญด้านอสังหาริมทรัพย์ระดับพรีเมียมในภูเก็ต"
                  : "Luxury real estate specialists in Phuket"}
              </Paragraph>
            </div>

            <div>
              <Title level={4} className="!text-white !mb-4 !text-lg">
                {language === "th" ? "ลิงก์ด่วน" : "Quick Links"}
              </Title>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                  >
                    {language === "th" ? "หน้าแรก" : "Home"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/product"
                    className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                  >
                    {language === "th" ? "อสังหาริมทรัพย์" : "Properties"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/aboutUs"
                    className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                  >
                    {language === "th" ? "เกี่ยวกับเรา" : "About Us"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contactUs"
                    className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                  >
                    {language === "th" ? "ติดต่อเรา" : "Contact"}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <Title level={4} className="!text-white !mb-4 !text-lg">
                {language === "th" ? "ติดต่อเรา" : "Contact Us"}
              </Title>
              <ul className="space-y-2 !text-gray-400">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-2 mt-0.5 text-[#D4AF37]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {language === "th"
                    ? "111/151 หมู่ 4 ศุภาลัย เบลล่า, ตำบลเกาะแก้ว, อำเภอเมือง, จังหวัดภูเก็ต 83000"
                    : "111/151 Moo 4 Supalai bella , Kohkeaw, Muang , Phuket 83000"}
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-[#D4AF37]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  093-781-2945 , 087-276-1225
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-[#D4AF37]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  rubyagent7@gmail.com
                </li>
              </ul>
            </div>

            <div>
              <Title level={4} className="!text-white !mb-4 !text-lg">
                {language === "th" ? "ติดตามเรา" : "Follow Us"}
              </Title>
              <div className="flex space-x-4">
                <Link
                  href="https://www.facebook.com/share/1YxgLiRMzk/?mibextid=wwXIfr"
                  className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </Link>
                <Link
                  href="https://www.instagram.com/ruby_real_estate_phuket/"
                  className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </Link>
                <Link
                  href="https://line.me/ti/p/x5SIaYWNt4"
                  target="_blank"
                  className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-colors"
                >
                  <Image
                    src="/social-line.svg"
                    alt="Line"
                    width={50}
                    height={50}
                    className="transition duration-200 [filter:brightness(0)_invert(76%)_sepia(30%)_saturate(1000%)_hue-rotate(5deg)] hover:[filter:brightness(0)_invert(100%)]"
                  />
                </Link>
              </div>
            </div>
          </div>

          <Divider className="!border-gray-800 !my-8" />

          <div className="text-center text-gray-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Ruby&apos;s Real Estate.{" "}
              {language === "th"
                ? "สงวนลิขสิทธิ์ทุกประการ"
                : "All rights reserved."}
            </p>
          </div>
        </div>
      </footer>

      {/* Social Media Floating Menu */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
        {isMenuOpen && (
          <>
            <a
              href="https://wa.me/66937812945"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
              title={
                language === "th" ? "แชทผ่าน WhatsApp" : "Chat via WhatsApp"
              }
            >
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                width={30}
                height={30}
              />
            </a>

            <a
              href="https://www.facebook.com/share/1YxgLiRMzk/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1877F2] w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
              title={
                language === "th"
                  ? "ติดต่อผ่าน Facebook"
                  : "Contact via Facebook"
              }
            >
              <svg
                className="w-7 h-7 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>

            <a
              href="https://www.instagram.com/ruby_real_estate_phuket/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-500 to-pink-500 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
              title={
                language === "th"
                  ? "ติดต่อผ่าน Instagram"
                  : "Contact via Instagram"
              }
            >
              <svg
                className="w-7 h-7 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
              </svg>
            </a>

            <a
              href="https://line.me/ti/p/x5SIaYWNt4"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#06C755] w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
              title={language === "th" ? "ติดต่อผ่าน Line" : "Contact via Line"}
            >
              <Image
                src="/social-line.svg"
                alt="Line"
                width={50}
                height={50}
                className="[filter:brightness(0)_invert(100%)]"
              />
            </a>
          </>
        )}

        {/* Main Button */}
        <button
          onClick={toggleMenu}
          className="bg-[#D4AF37] w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-[#C9A227] transition-all duration-300"
          aria-label={language === "th" ? "เมนูติดต่อ" : "Contact menu"}
        >
          {isMenuOpen ? (
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
