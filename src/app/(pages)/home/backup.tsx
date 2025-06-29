'use client';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      {/* Hero Section with Fixed Search Box */}
      <div className="relative py-16 px-4 md:px-20 text-center text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Phuket Beach"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find your dream home in Phuket</h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Explore our exclusive collection of luxury properties in Phuket's most sought-after locations.
          </p>
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search by location, property type, or keyword"
              className="px-4 py-2 rounded-l-lg border border-gray-300 w-full max-w-xl text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button className="bg-blue-700 text-white px-6 py-2 rounded-r-lg hover:bg-blue-800 font-medium">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Featured Properties - เปลี่ยนเป็นสีขาวทั้งหมด */}
      <div className="py-12 px-4 md:px-20 bg-white"> {/* เพิ่ม bg-white ที่ container หลัก */}
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Property 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 relative">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Luxury Villa in Kamala"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 text-gray-800">Luxury Villa in Kamala</h3>
              <p className="text-gray-600">5 Bedrooms | 6 Bathrooms | Private Pool</p>
            </div>
          </div>

          {/* Property 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 relative">
              <Image
                src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Beachfront Condo in Patong"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 text-gray-800">Beachfront Condo in Patong</h3>
              <p className="text-gray-600">2 Bedrooms | 2 Bathrooms | Ocean View</p>
            </div>
          </div>

          {/* Property 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 relative">
              <Image
                src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Modern Apartment in Surin"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 text-gray-800">Modern Apartment in Surin</h3>
              <p className="text-gray-600">1 Bedroom | 1 Bathroom | City Center</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}