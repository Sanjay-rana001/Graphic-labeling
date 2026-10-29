import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Admin Workshop Portal | Sourav Graphic & Metal Labels",
  description: "Manage custom metal orders, laser queue, commercial leads, and material inventory.",
};

export default function AdminPage() {
  return (
    <main>
      <AdminDashboard />
    </main>
  );
}

