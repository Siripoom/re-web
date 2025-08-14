import LayoutWrapper from "@/components/LayoutWrapper";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // ครอบ AdminLayout ด้วย LayoutWrapper เพื่อเช็ค login
  return (
    <LayoutWrapper>
      <AdminLayout>{children}</AdminLayout>
    </LayoutWrapper>
  );
}