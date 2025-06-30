"use client";
import Image from "next/image";

export default function Footer() {
  return (
    <>
      <footer className="bg-gray-100 py-8 px-4 md:px-20 mt-auto border-t border-gray-200">
        <div className="flex flex-col items-center">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mb-4 text-center">
            <a
              href="#"
              className="text-gray-700 hover:text-red-700 font-medium"
            >
              Contact Us
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-red-700 font-medium"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-red-700 font-medium"
            >
              Terms of Service
            </a>
          </div>
          <div className="text-gray-600 text-center">
            {" "}
            © 2024 Ruby&quot;s Real Estate, All rights reserved
          </div>
        </div>
      </footer>

      <WhatsAppButton />
    </>
  );
}

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/66812345678"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
    >
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="แชทผ่าน WhatsApp"
        width={56}
        height={56}
        className="hover:scale-110 transition-transform duration-300 drop-shadow-lg"
      />
    </a>
  );
}
