import type { Metadata } from "next";
import { AdminProvider } from "@/components/admin/AdminContext";

export const metadata: Metadata = {
  title: "Admin Portal | Cake Eats",
  description: "Staff management console for Cake Eats",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-cream text-espresso selection:bg-caramel selection:text-warm-white">
        {children}
      </div>
    </AdminProvider>
  );
}
