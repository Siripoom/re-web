// src/services/userService.ts
import { supabase } from "@/config/supabase";
import bcrypt from 'bcryptjs';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserSearchFilters,
  LoginRequest,
  LoginResponse,
  UserStats,
} from "@/types/user";

export class UserService {
  // ดึงข้อมูลผู้ใช้ทั้งหมด
  static async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      throw error;
    }

    return (data || []).map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // ดึงข้อมูลผู้ใช้ตาม ID
  static async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      throw error;
    }

    if (!data) return null;

    const { password, ...userWithoutPassword } = data;
    return userWithoutPassword;
  }

  // ค้นหาผู้ใช้
  static async searchUsers(filters: UserSearchFilters): Promise<User[]> {
    let query = supabase.from("users").select("*");

    if (filters.search_term) {
      query = query.or(
        `username.ilike.%${filters.search_term}%,name.ilike.%${filters.search_term}%`
      );
    }

    if (filters.role) {
      query = query.eq("role", filters.role);
    }

    if (filters.is_active !== undefined) {
      query = query.eq("is_active", filters.is_active);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error searching users:", error);
      throw error;
    }

    return (data || []).map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // สร้างผู้ใช้ใหม่ (แก้ไขแล้ว)
static async createUser(userData: CreateUserRequest): Promise<User> {
  try {
    const hashedPassword = await this.hashPassword(userData.password);
    const payload = {
      ...userData,
      password: hashedPassword,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log("Payload >>>", payload);

    const { data, error } = await supabase
      .from("users")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (!data) throw new Error("No user data returned");

    const { password, ...userWithoutPassword } = data;
    return userWithoutPassword;
  } catch (err: any) {
    console.error("Create user error:", err);
    throw err;
  }
}


  // อัปเดตผู้ใช้
  static async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    let updateData = { ...userData };

    if (userData.password) {
      updateData.password = await this.hashPassword(userData.password);
    }

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      throw error;
    }

    const { password, ...userWithoutPassword } = data;
    return userWithoutPassword;
  }

  // ลบผู้ใช้
  static async deleteUser(id: string): Promise<void> {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  // เปิด/ปิดการใช้งาน
  static async toggleUserStatus(id: string, isActive: boolean): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .update({ is_active: isActive })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error toggling user status:", error);
      throw error;
    }

    const { password, ...userWithoutPassword } = data;
    return userWithoutPassword;
  }

  // ตรวจสอบชื่อผู้ใช้
  static async checkUsernameExists(username: string, excludeId?: string): Promise<boolean> {
    let query = supabase.from("users").select("id").eq("username", username);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error checking username:", error);
      throw error;
    }

    return (data || []).length > 0;
  }

  // เข้าสู่ระบบ
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", credentials.username)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      throw new Error("Invalid username or password");
    }

    const isPasswordValid = await this.verifyPassword(
      credentials.password,
      data.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
    }

    await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", data.id);

    const { password, ...userWithoutPassword } = data;

    return {
      user: userWithoutPassword,
    };
  }

  // ดึงสถิติ
  static async getUserStats(): Promise<UserStats> {
    const { data, error } = await supabase
      .from("users")
      .select("role, is_active");

    if (error) {
      console.error("Error fetching user stats:", error);
      throw error;
    }

    const totalUsers = data?.length || 0;
    const activeUsers = data?.filter((u) => u.is_active).length || 0;
    const inactiveUsers = totalUsers - activeUsers;

    const roleStats = data?.reduce((acc: Record<string, number>, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {}) || {};

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      roleStats,
    };
  }

  // รีเซ็ตรหัสผ่าน
  static async resetPassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await this.hashPassword(newPassword);

    const { error } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", id);

    if (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  }

  // ผู้ใช้ที่เข้าสู่ระบบล่าสุด
  static async getRecentActiveUsers(limit: number = 5): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .not("last_login", "is", null)
      .eq("is_active", true)
      .order("last_login", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recent active users:", error);
      throw error;
    }

    return (data || []).map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  private static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

private static async verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    if (hashedPassword === password) {
      console.warn("Warning: Using plain text password comparison");
      return true;
    }

    try {
      const decodedPassword = atob(hashedPassword);
      if (decodedPassword === password) {
        console.warn("Warning: Using base64 password comparison");
        return true;
      }
    } catch (e) {

    }

    const isBcryptMatch = await bcrypt.compare(password, hashedPassword);
    if (isBcryptMatch) {
      return true;
    }

    return false;
  } catch (err) {
    console.error("Password verification error:", err);
    return false;
  }
}
}