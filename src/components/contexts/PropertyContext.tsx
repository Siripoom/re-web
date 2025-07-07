'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PropertyService } from '@/services/propertyService';
import type { Property } from '@/types/property';

interface PropertyContextType {
  allProperties: Property[]; // เพิ่ม allProperties
  featuredProperties: Property[];
  loading: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allProperties, setAllProperties] = useState<Property[]>([]); // เพิ่ม state นี้
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const all = await PropertyService.getAllProperties();
        await new Promise((res) => setTimeout(res, 1000)); // simulate delay
        if (!cancelled) {
          setAllProperties(all); // เก็บข้อมูลทั้งหมด
          setFeaturedProperties(all.slice(0, 3)); // เก็บเฉพาะ featured (3 รายการแรก)
          setLoading(false);
        }
      } catch (e) {
        console.error('Error fetching properties:', e);
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PropertyContext.Provider value={{ allProperties, featuredProperties, loading }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const usePropertyContext = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('usePropertyContext must be used within PropertyProvider');
  }
  return context;
};