"use client";

import { useState, useSyncExternalStore } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Award,
  CreditCard,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import {
  mockLast7DaysSales,
  mockLast30DaysSales,
  mockTodayHourlySales,
  mockTopProducts,
  mockSalesByCategory,
  mockSalesByPayment,
} from "@/data/admin-mock";
import { CAFE_CONFIG } from "@/data/menu";

type DateRange = "today" | "7d" | "30d";

// Warm café palette for charts
const CATEGORY_COLORS = ["#C68B59", "#3B2418", "#7A5C48", "#A9693A", "#D4A373"];
const PAYMENT_COLORS = ["#C68B59", "#3B2418", "#7A5C48"];

interface TooltipItem {
  name?: string;
  value: number;
  dataKey?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipItem[];
  label?: string;
}

function CustomChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-warm-white p-3 rounded-xl border border-caramel/25 shadow-lg text-xs font-sans">
        {label && <p className="font-semibold text-espresso">{label}</p>}
        {payload.map((item, idx) => (
          <p key={idx} className="text-caramel mt-1 font-medium">
            {item.name || "Value"}:{" "}
            <span className="font-bold text-espresso">
              {typeof item.value === "number" && item.value > 100 && !item.name?.includes("Quantity")
                ? `${CAFE_CONFIG.currencySymbol}${item.value.toFixed(2)}`
                : item.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// React 19 safe SSR mount snapshot
function subscribeNoop() {
  return () => {};
}

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("7d");

  const isMounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );

  // Sales data according to selected date range
  const salesOverTimeData = {
    today: mockTodayHourlySales,
    "7d": mockLast7DaysSales,
    "30d": mockLast30DaysSales,
  }[dateRange];

  // Dynamic summary metrics based on date range
  const summaryMetrics = {
    today: {
      totalSales: "$625.00",
      totalOrders: 54,
      avgTicket: "$11.57",
      growth: "+14.2% vs yesterday",
    },
    "7d": {
      totalSales: "$4,640.00",
      totalOrders: 412,
      avgTicket: "$11.26",
      growth: "+9.4% week-over-week",
    },
    "30d": {
      totalSales: "$18,920.00",
      totalOrders: 1684,
      avgTicket: "$11.23",
      growth: "+18.5% month-over-month",
    },
  }[dateRange];

  return (
    <div className="space-y-6 sm:space-y-8 font-sans">
      {/* Page Header & Date Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-espresso font-normal tracking-tight">
            Café Analytics
          </h1>
          <p className="text-xs sm:text-sm text-mocha mt-1">
            Revenue velocity, popular menu items, category contribution, and settlement breakdowns.
          </p>
        </div>

        {/* Date Range Selector Pills */}
        <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-warm-white border border-caramel/25 shadow-xs self-start sm:self-auto">
          {[
            { label: "Today", value: "today" as DateRange },
            { label: "Last 7 Days", value: "7d" as DateRange },
            { label: "Last 30 Days", value: "30d" as DateRange },
          ].map((item) => {
            const isSelected = dateRange === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setDateRange(item.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-caramel text-warm-white shadow-xs"
                    : "text-mocha hover:text-espresso hover:bg-cream"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-warm-white border border-caramel/20 shadow-xs">
          <div className="flex items-center justify-between text-mocha">
            <span className="text-xs uppercase tracking-wider font-semibold">
              Period Gross Revenue
            </span>
            <DollarSign className="w-4 h-4 text-caramel" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-espresso mt-1 font-sans">
            {summaryMetrics.totalSales}
          </h3>
          <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>{summaryMetrics.growth}</span>
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-warm-white border border-caramel/20 shadow-xs">
          <div className="flex items-center justify-between text-mocha">
            <span className="text-xs uppercase tracking-wider font-semibold">
              Total Tickets
            </span>
            <ShoppingBag className="w-4 h-4 text-caramel" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-espresso mt-1 font-sans">
            {summaryMetrics.totalOrders}
          </h3>
          <p className="text-[11px] text-mocha mt-1">
            Registered at café counter
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-warm-white border border-caramel/20 shadow-xs">
          <div className="flex items-center justify-between text-mocha">
            <span className="text-xs uppercase tracking-wider font-semibold">
              Average Ticket Size
            </span>
            <TrendingUp className="w-4 h-4 text-caramel" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-espresso mt-1 font-sans">
            {summaryMetrics.avgTicket}
          </h3>
          <p className="text-[11px] text-mocha mt-1">
            Per customer transaction
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-warm-white border border-caramel/20 shadow-xs">
          <div className="flex items-center justify-between text-mocha">
            <span className="text-xs uppercase tracking-wider font-semibold">
              Lead Category
            </span>
            <Award className="w-4 h-4 text-caramel" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-espresso mt-1 font-sans">
            Coffee
          </h3>
          <p className="text-[11px] text-mocha mt-1">
            32.8% of gross receipts
          </p>
        </div>
      </div>

      {/* Charts Grid: 2x2 Layout, fully responsive on tablets & phones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Sales Over Time (Line Chart) */}
        <div className="bg-warm-white p-5 sm:p-6 rounded-2xl border border-caramel/20 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif text-lg text-espresso font-normal">
                Sales Velocity Over Time
              </h2>
              <p className="text-xs text-mocha mt-0.5">
                Gross sales progression for the selected timeframe
              </p>
            </div>
            <Calendar className="w-4 h-4 text-caramel shrink-0" />
          </div>

          <div className="h-[280px] w-full pt-2">
            {!isMounted ? (
              <div className="h-full flex items-center justify-center bg-cream/30 rounded-xl text-xs text-mocha">
                Loading line chart...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesOverTimeData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#FAF3E8" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="#7A5C48"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#FAF3E8" }}
                  />
                  <YAxis
                    stroke="#7A5C48"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Line
                    type="monotone"
                    name="Sales"
                    dataKey="sales"
                    stroke="#C68B59"
                    strokeWidth={3}
                    dot={{ fill: "#3B2418", r: 4 }}
                    activeDot={{ r: 6, fill: "#C68B59" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 2. Top-Selling Products (Bar Chart) */}
        <div className="bg-warm-white p-5 sm:p-6 rounded-2xl border border-caramel/20 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif text-lg text-espresso font-normal">
                Top-Selling Products
              </h2>
              <p className="text-xs text-mocha mt-0.5">
                Highest volume products by total units sold
              </p>
            </div>
            <Award className="w-4 h-4 text-caramel shrink-0" />
          </div>

          <div className="h-[280px] w-full pt-2">
            {!isMounted ? (
              <div className="h-full flex items-center justify-center bg-cream/30 rounded-xl text-xs text-mocha">
                Loading bar chart...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockTopProducts}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 25, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#FAF3E8" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#7A5C48"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#7A5C48"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={110}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Bar
                    dataKey="quantity"
                    name="Units Sold"
                    fill="#C68B59"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 3. Sales by Category (Donut Chart) */}
        <div className="bg-warm-white p-5 sm:p-6 rounded-2xl border border-caramel/20 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif text-lg text-espresso font-normal">
                Sales by Category
              </h2>
              <p className="text-xs text-mocha mt-0.5">
                Revenue contribution across menu categories
              </p>
            </div>
            <Layers className="w-4 h-4 text-caramel shrink-0" />
          </div>

          <div className="h-[280px] w-full pt-2">
            {!isMounted ? (
              <div className="h-full flex items-center justify-center bg-cream/30 rounded-xl text-xs text-mocha">
                Loading category chart...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockSalesByCategory}
                    cx="50%"
                    cy="48%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {mockSalesByCategory.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 4. Sales by Payment Method (Donut/Breakdown Chart) */}
        <div className="bg-warm-white p-5 sm:p-6 rounded-2xl border border-caramel/20 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif text-lg text-espresso font-normal">
                Settlement by Payment Method
              </h2>
              <p className="text-xs text-mocha mt-0.5">
                Staff counter payment methods distribution
              </p>
            </div>
            <CreditCard className="w-4 h-4 text-caramel shrink-0" />
          </div>

          <div className="h-[280px] w-full pt-2">
            {!isMounted ? (
              <div className="h-full flex items-center justify-center bg-cream/30 rounded-xl text-xs text-mocha">
                Loading payment chart...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockSalesByPayment}
                    cx="50%"
                    cy="48%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {mockSalesByPayment.map((_, index) => (
                      <Cell
                        key={`cell-pay-${index}`}
                        fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
