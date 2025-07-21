// services/propertyService.ts
import { supabase } from "@/config/supabase";
import {
  Property,
  PropertyImage,
  CreatePropertyRequest,
  PropertySearchFilters,
} from "@/types/property";

export class PropertyService {
  // ดึงข้อมูลพื้นที่ทั้งหมด
  static async getLocations(): Promise<string[]> {
    const { data, error } = await supabase
      .from("properties")
      .select("location")
      .not("location", "is", null);

    if (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }

    // Remove duplicates and return sorted array
    const uniqueLocations = Array.from(
      new Set(data?.map((item) => item.location))
    ).sort();

    return uniqueLocations || [];
  }

  // ดึงข้อมูลประเภทอสังหาทั้งหมด
  static async getPropertyTypes(): Promise<string[]> {
    const { data, error } = await supabase
      .from("properties")
      .select("property_type")
      .not("property_type", "is", null);

    if (error) {
      console.error("Error fetching property types:", error);
      throw error;
    }

    // Remove duplicates and return sorted array
    const uniqueTypes = Array.from(
      new Set(data?.map((item) => item.property_type))
    ).sort();

    return uniqueTypes || [];
  }

  // ดึงข้อมูลอสังหาทั้งหมด
  static async getAllProperties(): Promise<Property[]> {
    const { data, error } = await supabase
      .from("properties")
      .select(
        `
        *,
        images:property_images(*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }

    return data || [];
  }

  // ดึงข้อมูลอสังหาที่ featured
  static async getFeaturedProperties(): Promise<Property[]> {
    const { data, error } = await supabase
      .from("properties")
      .select(
        `
        *,
        images:property_images(*)
      `
      )
      .eq("featured", true)
      .eq("status", "Available")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching featured properties:", error);
      throw error;
    }

    return data || [];
  }

  // ดึงข้อมูลอสังหาตาม ID
  static async getPropertyById(id: string): Promise<Property | null> {
    const { data, error } = await supabase
      .from("properties")
      .select(
        `
        *,
        images:property_images(*)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching property:", error);
      throw error;
    }

    return data;
  }

  // ค้นหาอสังหาตามเงื่อนไข
  static async searchProperties(
    filters: PropertySearchFilters
  ): Promise<Property[]> {
    let query = supabase.from("properties").select(`
        *,
        images:property_images(*)
      `);

    // Filter by location
    if (filters.location) {
      query = query.eq("location", filters.location);
    }

    // Filter by property type
    if (filters.property_type) {
      query = query.eq("property_type", filters.property_type);
    }

    // Filter by price range
    if (filters.min_price) {
      query = query.gte("price", filters.min_price);
    }
    if (filters.max_price) {
      query = query.lte("price", filters.max_price);
    }

    // Filter by bedrooms
    if (filters.min_bedrooms) {
      query = query.gte("bedrooms", filters.min_bedrooms);
    }
    if (filters.max_bedrooms) {
      query = query.lte("bedrooms", filters.max_bedrooms);
    }

    // Filter featured only
    if (filters.featured_only) {
      query = query.eq("featured", true);
    }

    // Search by name or description
    if (filters.search_term) {
      query = query.or(
        `name.ilike.%${filters.search_term}%,description.ilike.%${filters.search_term}%`
      );
    }

    // Only show available properties for public
    query = query.eq("status", "Available");

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error searching properties:", error);
      throw error;
    }

    return data || [];
  }

  // สร้างอสังหาใหม่
  static async createProperty(
    propertyData: CreatePropertyRequest
  ): Promise<Property> {
    const { data, error } = await supabase
      .from("properties")
      .insert([propertyData])
      .select()
      .single();

    if (error) {
      console.error("Error creating property:", error);
      throw error;
    }

    return data;
  }

  // อัปเดตข้อมูลอสังหา
  static async updateProperty(
    id: string,
    propertyData: Partial<CreatePropertyRequest>
  ): Promise<Property> {
    const { data, error } = await supabase
      .from("properties")
      .update(propertyData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating property:", error);
      throw error;
    }

    return data;
  }

  // ลบอสังหา
  static async deleteProperty(id: string): Promise<void> {
    const { error } = await supabase.from("properties").delete().eq("id", id);

    if (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  }

  // อัปโหลดรูปภาพ
  static async uploadImage(file: File, propertyId: string): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${propertyId}/${Date.now()}.${fileExt}`;
    const filePath = `properties/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("property-images").getPublicUrl(filePath);

    return publicUrl;
  }

  // เพิ่มข้อมูลรูปภาพใน database
  static async addPropertyImage(
    propertyId: string,
    imageUrl: string,
    imagePath: string,
    altText?: string,
    isPrimary: boolean = false,
    displayOrder: number = 0
  ): Promise<PropertyImage> {
    const { data, error } = await supabase
      .from("property_images")
      .insert([
        {
          property_id: propertyId,
          image_url: imageUrl,
          image_path: imagePath,
          alt_text: altText,
          is_primary: isPrimary,
          display_order: displayOrder,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding property image:", error);
      throw error;
    }

    return data;
  }

  // ลบรูปภาพ
  static async deletePropertyImage(imageId: string): Promise<void> {
    // ดึงข้อมูลรูปภาพก่อนลบ
    const { data: image, error: fetchError } = await supabase
      .from("property_images")
      .select("image_path")
      .eq("id", imageId)
      .single();

    if (fetchError) {
      console.error("Error fetching image:", fetchError);
      throw fetchError;
    }

    // ลบรูปภาพจาก storage
    const { error: storageError } = await supabase.storage
      .from("property-images")
      .remove([image.image_path]);

    if (storageError) {
      console.error("Error deleting image from storage:", storageError);
      throw storageError;
    }

    // ลบข้อมูลรูปภาพจาก database
    const { error: dbError } = await supabase
      .from("property_images")
      .delete()
      .eq("id", imageId);

    if (dbError) {
      console.error("Error deleting image from database:", dbError);
      throw dbError;
    }
  }

  // ดึงรูปภาพทั้งหมดของอสังหา
  static async getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
    const { data, error } = await supabase
      .from("property_images")
      .select("*")
      .eq("property_id", propertyId)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching property images:", error);
      throw error;
    }

    return data || [];
  }

  // ตั้งค่ารูปหลัก
  static async setPrimaryImage(
    imageId: string,
    propertyId: string
  ): Promise<void> {
    // เซ็ตรูปอื่นๆ ให้ไม่เป็นรูปหลัก
    await supabase
      .from("property_images")
      .update({ is_primary: false })
      .eq("property_id", propertyId);

    // เซ็ตรูปที่เลือกให้เป็นรูปหลัก
    const { error } = await supabase
      .from("property_images")
      .update({ is_primary: true })
      .eq("id", imageId);

    if (error) {
      console.error("Error setting primary image:", error);
      throw error;
    }
  }

  // ดึงสถิติอสังหา
  static async getPropertyStats() {
    const { data, error } = await supabase
      .from("properties")
      .select("status, property_type, location");

    if (error) {
      console.error("Error fetching property stats:", error);
      throw error;
    }

    const totalProperties = data?.length || 0;
    const availableProperties =
      data?.filter((p: { status: string }) => p.status === "Available").length || 0;
    const soldProperties = data?.filter((p: { status: string }) => p.status === "Sold").length || 0;
    const rentedProperties =
      data?.filter((p: { status: string }) => p.status === "Rented").length || 0;

    const propertyTypeStats =
      data?.reduce(
        (acc: Record<string, number>, property: { property_type: string | number }) => {
          acc[String(property.property_type)] = (acc[String(property.property_type)] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ) || {};

    const locationStats =
      data?.reduce(
        (acc: Record<string, number>, property: { location: string }) => {
          acc[property.location] = (acc[property.location] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ) || {};

    return {
      totalProperties,
      availableProperties,
      soldProperties,
      rentedProperties,
      propertyTypeStats,
      locationStats,
    };
  }
}