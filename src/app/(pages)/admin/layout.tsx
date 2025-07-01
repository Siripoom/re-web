// src/app/(pages)/admin/layout.tsx
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
