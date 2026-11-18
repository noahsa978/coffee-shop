"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Coffee,
  Tags,
  ShoppingBag,
  Boxes,
  BarChart3,
  X,
  ShieldCheck,
} from "lucide-react";
import { CAFE_CONFIG } from "@/data/menu";
import { useAdminUser } from "./AdminContext";

interface NavItem {
  name: string;
  href: string;
  key: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    key: "dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/dashboard/products",
    key: "products",
    icon: Coffee,
  },
  {
    name: "Categories",
    href: "/admin/dashboard/categories",
    key: "categories",
    icon: Tags,
  },
  {
    name: "Orders",
    href: "/admin/dashboard/orders",
    key: "orders",
    icon: ShoppingBag,
  },
  {
    name: "Inventory",
    href: "/admin/dashboard/inventory",
    key: "inventory",
    icon: Boxes,
  },
  {
    name: "Analytics",
    href: "/admin/dashboard/analytics",
    key: "analytics",
    icon: BarChart3,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { currentUser, hasPermission } = useAdminUser();

  // Filter items driven by role permissions config
  const allowedNavItems = NAV_ITEMS.filter((item) =>
    hasPermission(item.key)
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-espresso/60 backdrop-blur-xs md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-warm-white border-r border-caramel/20 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Admin Navigation"
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-caramel/15 bg-warm-white">
          <Link
            href="/admin/dashboard"
            className="flex flex-col group focus:outline-none focus-visible:ring-2 focus-visible:ring-caramel rounded"
            onClick={onClose}
          >
            <span className="font-serif text-xl font-normal text-espresso tracking-tight">
              {CAFE_CONFIG.name}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-caramel font-semibold">
              Management Portal
            </span>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-mocha hover:text-espresso hover:bg-cream md:hidden"
            aria-label="Close navigation sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {allowedNavItems.map((item) => {
            const Icon = item.icon;
            // Precise active matching (exact for dashboard, prefix for sub-routes)
            const isActive =
              item.href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-caramel text-warm-white shadow-xs"
                    : "text-espresso hover:text-caramel hover:bg-cream active:bg-caramel/10"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-warm-white" : "text-mocha"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Role Notice & Security Reminder in Sidebar footer */}
        <div className="p-4 border-t border-caramel/15 bg-cream/40">
          <div className="flex items-start gap-2 text-xs text-mocha">
            <ShieldCheck className="w-4 h-4 text-caramel shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-espresso">Role: {currentUser.role}</p>
              <p className="text-[11px] text-mocha/80 leading-tight mt-0.5">
                Front-end preview. Server-side authorization enforced on API.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
