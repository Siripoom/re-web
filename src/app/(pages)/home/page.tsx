"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-white py-10 px-4">
        <div className="max-w-6xl mx-auto rounded-xl overflow-hidden shadow-md relative h-[500px]">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Phuket Beach"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-end items-start text-white text-left pl-8 md:pl-16 pr-4 pb-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Find your dream home in Phuket
            </h1>
            <p className="text-lg md:text-xl  mb-6">
              Explore our exclusive collection of luxury properties in
              PhuketRuby&quot;s Real Estate Phukets most sought-after locations.
            </p>
            <div className="w-full max-w-xl flex">
              <input
                type="text"
                placeholder="Search by location, property type, or keyword"
                className="w-3/4 px-4 py-3 rounded-l-lg border border-gray-300 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <button className="w-1/4 bg-blue-700 text-white px-4 py-3 rounded-r-lg hover:bg-blue-800 font-medium">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-center text-gray-800">
            Featured Properties
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Property 1 */}
            <Link href="/property" className="hover:no-underline">
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                <div className="relative h-48">
                  <Image
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Luxury Villa in Kamala"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">
                    Luxury Villa in Kamala
                  </h3>
                  <p className="text-gray-600 text-sm">
                    4 Bedrooms | 4 Bathrooms | Private Pool
                  </p>
                </div>
              </div>
            </Link>

            {/* Property 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Beachfront Condo in Patong"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  Beachfront Condo in Patong
                </h3>
                <p className="text-gray-600 text-sm">
                  2 Bedrooms | 2 Bathrooms | Ocean View
                </p>
              </div>
            </div>

            {/* Property 3 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Modern Apartment in Surin"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  Modern Apartment in Surin
                </h3>
                <p className="text-gray-600 text-sm">
                  1 Bedroom | 1 Bathroom | City Center
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
