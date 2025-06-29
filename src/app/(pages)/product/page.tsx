'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function PropertySearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const properties = [
    {
      id: 1,
      title: 'Luxury Villa in Kamala',
      beds: 4,
      baths: 4,
      area: 3500,
      type: 'Villa',
      location: 'Kamala',
      price: 25000000,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 2,
      title: 'Beachfront Condo in Patong',
      beds: 2,
      baths: 2,
      area: 1200,
      type: 'Condo',
      location: 'Patong',
      price: 12000000,
      image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 3,
      title: 'Modern Apartment in Rawai',
      beds: 1,
      baths: 1,
      area: 750,
      type: 'Apartment',
      location: 'Rawai',
      price: 6500000,
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 4,
      title: 'Spacious Family Home in Chalong',
      beds: 5,
      baths: 4,
      area: 4200,
      type: 'House',
      location: 'Chalong',
      price: 35000000,
      image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 5,
      title: 'Investment Property in Surin',
      beds: 3,
      baths: 3,
      area: 2800,
      type: 'Villa',
      location: 'Surin',
      price: 18000000,
      image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 6,
      title: 'Penthouse with Ocean Views in Kata',
      beds: 3,
      baths: 3,
      area: 2500,
      type: 'Penthouse',
      location: 'Kata',
      price: 22000000,
      image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    }
  ];

  const filteredProperties = properties.filter(property => {
    return (
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (location === '' || property.location === location) &&
      (propertyType === '' || property.type === propertyType) &&
      (priceRange === '' || 
        (priceRange === '0-10' && property.price < 10000000) ||
        (priceRange === '10-20' && property.price >= 10000000 && property.price < 20000000) ||
        (priceRange === '20+' && property.price >= 20000000))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white py-12 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Find Your Dream Property in Phuket</h1>
          
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by location, property type, or keyword"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="" className="text-gray-800">All Locations</option>
                <option value="Kamala" className="text-gray-800">Kamala</option>
                <option value="Patong" className="text-gray-800">Patong</option>
                <option value="Rawai" className="text-gray-800">Rawai</option>
                <option value="Chalong" className="text-gray-800">Chalong</option>
                <option value="Surin" className="text-gray-800">Surin</option>
                <option value="Kata" className="text-gray-800">Kata</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="" className="text-gray-800">All Types</option>
                <option value="Villa" className="text-gray-800">Villa</option>
                <option value="Condo" className="text-gray-800">Condo</option>
                <option value="Apartment" className="text-gray-800">Apartment</option>
                <option value="House" className="text-gray-800">House</option>
                <option value="Penthouse" className="text-gray-800">Penthouse</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (THB)</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="" className="text-gray-800">All Prices</option>
                <option value="0-10" className="text-gray-800">0 - 10M</option>
                <option value="10-20" className="text-gray-800">10M - 20M</option>
                <option value="20+" className="text-gray-800">20M+</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Property Results */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {filteredProperties.length} Properties Found
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <Link key={property.id} href={`/property/${property.id}`} className="hover:no-underline">
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                <div className="relative h-48">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {property.beds} Beds | {property.baths} Baths | {property.area.toLocaleString()} sq ft
                  </p>
                  <p className="text-blue-600 font-semibold">
                    {property.price.toLocaleString('en-US')} THB
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600">No properties match your search criteria</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    
    </div>
  );
}