import { CAFE_CONFIG, type Category, type Product } from "./menu";

export { CAFE_CONFIG, type Category, type Product };

// Role placeholders (easy to change)
export type StaffRole = "Manager" | "Cashier";

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
}

// Config-driven role permissions for navigation and features
export const ROLE_PERMISSIONS: Record<StaffRole, string[]> = {
  Manager: ["dashboard", "products", "categories", "orders", "inventory", "analytics"],
  Cashier: ["dashboard", "orders", "products"],
};

export const MOCK_STAFF_USERS: StaffUser[] = [
  {
    id: "usr-1",
    name: "Elena Vance",
    email: "elena@cakeeats.com",
    role: "Manager",
  },
  {
    id: "usr-2",
    name: "Leo Diaz",
    email: "leo@cakeeats.com",
    role: "Cashier",
  },
];

// Status values are placeholders in one constant (not final)
export const ORDER_STATUSES = ["Pending", "Completed", "Cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

// Payment methods recorded manually by staff
export const PAYMENT_METHODS = ["Cash", "Card", "Mobile money"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

// Feature flags
export const ADMIN_FEATURE_FLAGS = {
  // Flag for optional "Featured in banner" toggle on product edit
  showFeaturedInBannerToggle: true,
} as const;

export interface OrderItem {
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string; // ISO string
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  total: number;
  items: OrderItem[];
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
}

export interface StockChange {
  id: string;
  itemName: string;
  change: number; // e.g. +10 or -3
  reason: string;
  createdAt: string;
}

// Mock categories for Admin
export const initialAdminCategories: Category[] = [
  { id: "coffee", name: "Coffee", displayOrder: 1 },
  { id: "cake", name: "Cake", displayOrder: 2 },
  { id: "pastries", name: "Pastries", displayOrder: 3 },
  { id: "tea", name: "Artisanal Tea", displayOrder: 4 },
  { id: "savory", name: "Savory Bites", displayOrder: 5 },
];

// Mock products for Admin
export const initialAdminProducts: Product[] = [
  {
    id: "prod-c1",
    categoryId: "coffee",
    name: "Velvet Flat White",
    price: 4.85,
    imageUrl: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "Popular",
    isFeatured: true,
  },
  {
    id: "prod-c2",
    categoryId: "coffee",
    name: "Caramel Sea Salt Cortado",
    price: 5.25,
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "New",
    isFeatured: true,
  },
  {
    id: "prod-c3",
    categoryId: "coffee",
    name: "Brown Butter Vanilla Latte",
    price: 5.75,
    imageUrl: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "Popular",
    isFeatured: false,
  },
  {
    id: "prod-k1",
    categoryId: "cake",
    name: "Basque Burnt Cheesecake",
    price: 7.5,
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "Popular",
    isFeatured: true,
  },
  {
    id: "prod-k2",
    categoryId: "cake",
    name: "Honey Lavender Sponge",
    price: 6.95,
    imageUrl: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "New",
    isFeatured: true,
  },
  {
    id: "prod-p1",
    categoryId: "pastries",
    name: "Brown Butter Flaky Croissant",
    price: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "Popular",
    isFeatured: true,
  },
  {
    id: "prod-p3",
    categoryId: "pastries",
    name: "Swedish Cardamom Morning Bun",
    price: 4.85,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "New",
    isFeatured: true,
  },
  {
    id: "prod-t1",
    categoryId: "tea",
    name: "Ceremonial Uji Matcha Latte",
    price: 5.85,
    imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "Popular",
    isFeatured: false,
  },
  {
    id: "prod-s1",
    categoryId: "savory",
    name: "Gruyère & Smoked Ham Croissant",
    price: 6.85,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    tag: "Popular",
    isFeatured: false,
  },
  {
    id: "prod-c6",
    categoryId: "coffee",
    name: "Cardamom Spiced Mocha",
    price: 6.15,
    imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80",
    isAvailable: false,
    tag: null,
    isFeatured: false,
  },
];

// Mock finished product inventory items
export interface ProductStockItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
}

export const initialProductInventory: ProductStockItem[] = [
  {
    id: "inv-p1",
    productId: "prod-p1",
    name: "Brown Butter Flaky Croissant",
    category: "Pastries",
    quantity: 4, // Low stock trigger
    unit: "pcs",
    lowStockThreshold: 8,
  },
  {
    id: "inv-p2",
    productId: "prod-k1",
    name: "Basque Burnt Cheesecake",
    category: "Cake",
    quantity: 6,
    unit: "slices",
    lowStockThreshold: 5,
  },
  {
    id: "inv-p3",
    productId: "prod-p3",
    name: "Swedish Cardamom Morning Bun",
    category: "Pastries",
    quantity: 3, // Low stock trigger
    unit: "pcs",
    lowStockThreshold: 6,
  },
  {
    id: "inv-p4",
    productId: "prod-k2",
    name: "Honey Lavender Sponge",
    category: "Cake",
    quantity: 12,
    unit: "slices",
    lowStockThreshold: 5,
  },
  {
    id: "inv-p5",
    productId: "prod-s1",
    name: "Gruyère & Smoked Ham Croissant",
    category: "Savory Bites",
    quantity: 2, // Low stock trigger
    unit: "pcs",
    lowStockThreshold: 6,
  },
];

// Mock ingredients inventory
export const initialIngredients: Ingredient[] = [
  {
    id: "ing-1",
    name: "House Blend Espresso Beans",
    quantity: 3.5, // Low stock trigger
    unit: "kg",
    lowStockThreshold: 5.0,
  },
  {
    id: "ing-2",
    name: "Whole Milk (Organic)",
    quantity: 8,
    unit: "liters",
    lowStockThreshold: 10,
  },
  {
    id: "ing-3",
    name: "Barista Oat Milk",
    quantity: 14,
    unit: "liters",
    lowStockThreshold: 8,
  },
  {
    id: "ing-4",
    name: "Ceremonial Matcha Powder",
    quantity: 180, // Low stock trigger
    unit: "g",
    lowStockThreshold: 250,
  },
  {
    id: "ing-5",
    name: "Raw Cane Sugar",
    quantity: 12,
    unit: "kg",
    lowStockThreshold: 5,
  },
  {
    id: "ing-6",
    name: "Madagascar Vanilla Extract",
    quantity: 250,
    unit: "ml",
    lowStockThreshold: 100,
  },
];

// Mock stock adjustment history
export const initialStockChanges: StockChange[] = [
  {
    id: "chg-1",
    itemName: "House Blend Espresso Beans",
    change: +10,
    reason: "Weekly roastery delivery",
    createdAt: "2026-11-17T09:30:00Z",
  },
  {
    id: "chg-2",
    itemName: "Brown Butter Flaky Croissant",
    change: -2,
    reason: "Quality check / sample",
    createdAt: "2026-11-17T11:15:00Z",
  },
  {
    id: "chg-3",
    itemName: "Barista Oat Milk",
    change: +12,
    reason: "Restock from dry storage",
    createdAt: "2026-11-16T16:00:00Z",
  },
  {
    id: "chg-4",
    itemName: "Whole Milk (Organic)",
    change: -1,
    reason: "Spillage during morning rush",
    createdAt: "2026-11-16T10:20:00Z",
  },
];

// Mock counter orders
export const initialOrders: Order[] = [
  {
    id: "ord-101",
    orderNumber: "#1042",
    createdAt: "2026-11-17T13:45:00Z",
    status: "Completed",
    paymentMethod: "Card",
    total: 17.6,
    items: [
      { productName: "Velvet Flat White", unitPrice: 4.85, quantity: 2 },
      { productName: "Basque Burnt Cheesecake", unitPrice: 7.5, quantity: 1 },
      { productName: "Brown Butter Flaky Croissant", unitPrice: 4.5, quantity: 1 },
    ],
  },
  {
    id: "ord-102",
    orderNumber: "#1041",
    createdAt: "2026-11-17T13:20:00Z",
    status: "Completed",
    paymentMethod: "Cash",
    total: 9.75,
    items: [
      { productName: "Caramel Sea Salt Cortado", unitPrice: 5.25, quantity: 1 },
      { productName: "Brown Butter Flaky Croissant", unitPrice: 4.5, quantity: 1 },
    ],
  },
  {
    id: "ord-103",
    orderNumber: "#1040",
    createdAt: "2026-11-17T12:55:00Z",
    status: "Completed",
    paymentMethod: "Mobile money",
    total: 12.7,
    items: [
      { productName: "Ceremonial Uji Matcha Latte", unitPrice: 5.85, quantity: 1 },
      { productName: "Honey Lavender Sponge", unitPrice: 6.95, quantity: 1 },
    ],
  },
  {
    id: "ord-104",
    orderNumber: "#1039",
    createdAt: "2026-11-17T12:10:00Z",
    status: "Pending",
    paymentMethod: "Card",
    total: 21.35,
    items: [
      { productName: "Brown Butter Vanilla Latte", unitPrice: 5.75, quantity: 2 },
      { productName: "Swedish Cardamom Morning Bun", unitPrice: 4.85, quantity: 2 },
    ],
  },
  {
    id: "ord-105",
    orderNumber: "#1038",
    createdAt: "2026-11-17T11:30:00Z",
    status: "Cancelled",
    paymentMethod: "Cash",
    total: 4.85,
    items: [{ productName: "Velvet Flat White", unitPrice: 4.85, quantity: 1 }],
  },
  {
    id: "ord-106",
    orderNumber: "#1037",
    createdAt: "2026-11-17T10:45:00Z",
    status: "Completed",
    paymentMethod: "Card",
    total: 14.35,
    items: [
      { productName: "Basque Burnt Cheesecake", unitPrice: 7.5, quantity: 1 },
      { productName: "Gruyère & Smoked Ham Croissant", unitPrice: 6.85, quantity: 1 },
    ],
  },
];

// Mock 7-day sales for Dashboard & Analytics
export const mockLast7DaysSales = [
  { day: "Wed", date: "Nov 11", sales: 485, orders: 42 },
  { day: "Thu", date: "Nov 12", sales: 530, orders: 48 },
  { day: "Fri", date: "Nov 13", sales: 710, orders: 65 },
  { day: "Sat", date: "Nov 14", sales: 940, orders: 84 },
  { day: "Sun", date: "Nov 15", sales: 890, orders: 80 },
  { day: "Mon", date: "Nov 16", sales: 460, orders: 39 },
  { day: "Tue", date: "Nov 17", sales: 625, orders: 54 },
];

// Mock 30-day sales for Analytics
export const mockLast30DaysSales = [
  { day: "Oct 19", sales: 420, orders: 36 },
  { day: "Oct 22", sales: 510, orders: 44 },
  { day: "Oct 25", sales: 680, orders: 58 },
  { day: "Oct 28", sales: 590, orders: 50 },
  { day: "Oct 31", sales: 740, orders: 66 },
  { day: "Nov 3", sales: 620, orders: 54 },
  { day: "Nov 6", sales: 580, orders: 49 },
  { day: "Nov 9", sales: 690, orders: 60 },
  { day: "Nov 12", sales: 710, orders: 62 },
  { day: "Nov 15", sales: 890, orders: 80 },
  { day: "Nov 17", sales: 625, orders: 54 },
];

// Mock Today hourly sales for Analytics
export const mockTodayHourlySales = [
  { day: "7 AM", sales: 45, orders: 6 },
  { day: "8 AM", sales: 110, orders: 12 },
  { day: "9 AM", sales: 145, orders: 15 },
  { day: "10 AM", sales: 90, orders: 8 },
  { day: "11 AM", sales: 75, orders: 6 },
  { day: "12 PM", sales: 85, orders: 7 },
];
export const mockTopProducts = [
  { name: "Velvet Flat White", quantity: 138, revenue: 669.3 },
  { name: "Basque Burnt Cheesecake", quantity: 94, revenue: 705.0 },
  { name: "Brown Butter Croissant", quantity: 88, revenue: 396.0 },
  { name: "Cardamom Morning Bun", quantity: 72, revenue: 349.2 },
  { name: "Caramel Salt Cortado", quantity: 64, revenue: 336.0 },
];

// Mock Sales by category
export const mockSalesByCategory = [
  { name: "Coffee", value: 1420 },
  { name: "Cake", value: 1180 },
  { name: "Pastries", value: 920 },
  { name: "Tea", value: 430 },
  { name: "Savory", value: 390 },
];

// Mock Sales by payment method
export const mockSalesByPayment = [
  { name: "Card", value: 2450, percentage: 56 },
  { name: "Cash", value: 1120, percentage: 26 },
  { name: "Mobile money", value: 770, percentage: 18 },
];
