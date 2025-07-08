// src/services/userService.ts
import { supabase } from "@/config/supabase";
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

    // ไม่ส่ง password กลับไป
    return (data || []).map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    // ไม่ส่ง password กลับไป
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = data;
    return userWithoutPassword;
  }

  // ค้นหาผู้ใช้ตามเงื่อนไข
  static async searchUsers(filters: UserSearchFilters): Promise<User[]> {
    let query = supabase.from("users").select("*");

    // Filter by search term (username or name)
    if (filters.search_term) {
      query = query.or(
        `username.ilike.%${filters.search_term}%,name.ilike.%${filters.search_term}%`
      );
    }

    // Filter by role
    if (filters.role) {
      query = query.eq("role", filters.role);
    }

    // Filter by active status
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

    // ไม่ส่ง password กลับไป
    return (data || []).map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // สร้างผู้ใช้ใหม่
  static async createUser(userData: CreateUserRequest): Promise<User> {
    // Hash password ก่อนบันทึก (ในการใช้งานจริงควรใช้ bcrypt)
    const hashedPassword = await this.hashPassword(userData.password);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          ...userData,
          password: hashedPassword,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      throw error;
    }

    // ไม่ส่ง password กลับไป
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = data;
    return userWithoutPassword;
  }

  // อัปเดตข้อมูลผู้ใช้
  static async updateUser(
    id: string,
    userData: UpdateUserRequest
  ): Promise<User> {
    // eslint-disable-next-line prefer-const
    let updateData = { ...userData };

    // Hash password ใหม่ถ้ามีการเปลี่ยน
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

    // ไม่ส่ง password กลับไป
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // เปิด/ปิดการใช้งานผู้ใช้
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

    // ไม่ส่ง password กลับไป
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = data;
    return userWithoutPassword;
  }

  // ตรวจสอบว่า username ซ้ำหรือไม่
  static async checkUsernameExists(
    username: string,
    excludeId?: string
  ): Promise<boolean> {
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

  // เข้าสู่ระบบ (สำหรับอนาคต)
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", credentials.username)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      throw new Error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }

    // ตรวจสอบรหัสผ่าน (ในการใช้งานจริงควรใช้ bcrypt.compare)
    const isPasswordValid = await this.verifyPassword(
      credentials.password,
      data.password
    );

    if (!isPasswordValid) {
      throw new Error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }

    // อัปเดต last_login
    await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", data.id);

    // ไม่ส่ง password กลับไป
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = data;

    return {
      user: userWithoutPassword,
    };
  }

  // ดึงสถิติผู้ใช้
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

    const roleStats =
      data?.reduce((acc: Record<string, number>, user) => {
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

  // Helper function สำหรับ hash password
  private static async hashPassword(password: string): Promise<string> {
    // ในการใช้งานจริงควรใช้ bcrypt
    // npm install bcryptjs และ npm install -D @types/bcryptjs
    // import bcrypt from 'bcryptjs';
    // return await bcrypt.hash(password, 10);

    // สำหรับตัวอย่างใช้ simple encoding (ไม่ปลอดภัย)
    return btoa(password);
  }

  // Helper function สำหรับตรวจสอบ password
  private static async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    // ในการใช้งานจริงควรใช้ bcrypt
    // return await bcrypt.compare(password, hashedPassword);

    // สำหรับตัวอย่างใช้ simple decoding (ไม่ปลอดภัย)
    try {
      return atob(hashedPassword) === password;
    } catch {
      return false;
    }
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

  // ดึงรายการผู้ใช้ที่เข้าสู่ระบบล่าสุด
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

    // ไม่ส่ง password กลับไป
    return (data || []).map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}
