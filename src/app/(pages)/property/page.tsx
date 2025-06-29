'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function PropertyDetails() {
  return (
    <div className="bg-white min-h-screen">


      {/* Property Content */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Luxury Villa in Kamala</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <div className="relative h-96 rounded-xl overflow-hidden shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Luxury Villa in Kamala"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Property Details */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Property Details</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                  <p className="font-medium text-gray-400">4</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                  <p className="font-medium text-gray-400">4</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Living Area</p>
                  <p className="font-medium text-gray-400">450 sqm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Land Area</p>
                  <p className="font-medium text-gray-400">1200 sqm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pool</p>
                  <p className="font-medium text-gray-400">Private Infinity Pool</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">View</p>
                  <p className="font-medium text-gray-400">Ocean View</p>
                </div>
              </div>

              <button className="w-full bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-800 font-medium">
                Contact Agent
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Description</h2>
          <p className="text-gray-700 mb-6">
            This stunning villa offers breathtaking ocean views and luxurious amenities, perfect for a serene retreat or a family vacation. Located in the exclusive Kamala area, it provides privacy and easy access to the beach.
          </p>
        </div>

        {/* Amenities */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Amenities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input type="checkbox" checked readOnly className="mr-2 h-5 w-5 text-blue-600 rounded" />
              <span className="text-gray-700">Fully Equipped Kitchen</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" checked readOnly className="mr-2 h-5 w-5 text-blue-600 rounded" />
              <span className="text-gray-700">Air Conditioning</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" checked readOnly className="mr-2 h-5 w-5 text-blue-600 rounded" />
              <span className="text-gray-700">High-Speed Internet</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" checked readOnly className="mr-2 h-5 w-5 text-blue-600 rounded" />
              <span className="text-gray-700">Outdoor Dining Area</span>
            </div>
            <div className="flex items-center">
              <input type="checkbox" checked readOnly className="mr-2 h-5 w-5 text-blue-600 rounded" />
              <span className="text-gray-700">24/7 Security</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-gray-50 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Contact Information</h2>
          <p className="text-gray-700 mb-4">
            For inquiries and viewings, please contact our agent, Sophia Carter, at +66 76 555 1234 or email sophia.carter@rubyrealestate.com.
          </p>
          <button className="bg-blue-700 text-white py-3 px-6 rounded-lg hover:bg-blue-800 font-medium">
            Contact Agent
          </button>
        </div>
      </div>
    </div>
  );
}