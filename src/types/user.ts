// src/types/user.ts
export interface User {
  id: string;
  username: string;
  password?: string; // จะไม่ส่งมาจาก API ในกรณีปกติ
  name: string;
  role: "admin" | "super_admin" | "editor";
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  name: string;
  role: string;
  is_active?: boolean;
}

export interface UpdateUserRequest {
  username?: string;
  password?: string; // เฉพาะเมื่อต้องการเปลี่ยนรหัสผ่าน
  name?: string;
  role?: string;
  is_active?: boolean;
}

export interface UserSearchFilters {
  search_term?: string; // ค้นหาจาก username หรือ name
  role?: string;
  is_active?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<User, "password">;
  token?: string; // สำหรับอนาคตถ้าใช้ JWT
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  roleStats: Record<string, number>;
}

// Constants สำหรับ dropdown options
export const USER_ROLES = [
  { value: "admin", label: "Admin", description: "ผู้ดูแลระบบทั่วไป" },
  {
    value: "super_admin",
    label: "Super Admin",
    description: "ผู้ดูแลระบบสูงสุด",
  },
  { value: "editor", label: "Editor", description: "ผู้แก้ไขเนื้อหา" },
] as const;

export const USER_STATUS = [
  { value: true, label: "เปิดใช้งาน", color: "green" },
  { value: false, label: "ปิดใช้งาน", color: "red" },
] as const;

// Helper functions
export const getRoleLabel = (role: string): string => {
  const roleMap: Record<string, string> = {
    admin: "Admin",
    super_admin: "Super Admin",
    editor: "Editor",
  };
  return roleMap[role] || role;
};

export const getRoleColor = (role: string): string => {
  const colorMap: Record<string, string> = {
    admin: "blue",
    super_admin: "red",
    editor: "green",
  };
  return colorMap[role] || "default";
};

export const getStatusLabel = (isActive: boolean): string => {
  return isActive ? "เปิดใช้งาน" : "ปิดใช้งาน";
};

export const getStatusColor = (isActive: boolean): string => {
  return isActive ? "green" : "red";
};
