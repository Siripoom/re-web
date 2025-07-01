export interface Property {
  id: string;
  name: string;
  address: string;
  description?: string;
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
  living_rooms: number;
  car_parks: number;
  price: number;
  property_type: "Villa" | "Condo" | "House" | "Apartment" | "Penthouse";
  location?: string;
  area_sqm?: number;
  land_area_sqm?: number;
  status: "Available" | "Sold" | "Rented";
  featured: boolean;
  created_at: string;
  updated_at: string;
  type: string;
  images?: PropertyImage[];
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  image_path: string;
  alt_text?: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface CreatePropertyRequest {
  name: string;
  address: string;
  description?: string;
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
  living_rooms: number;
  car_parks: number;
  price: number;
  property_type: string;
  location?: string;
  area_sqm?: number;
  land_area_sqm?: number;
  status?: string;
  featured?: boolean;
  type: string;
}

export interface PropertySearchFilters {
  location?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
  featured_only?: boolean;
  search_term?: string;
  type: string;
}
