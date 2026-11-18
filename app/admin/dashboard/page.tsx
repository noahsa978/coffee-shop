import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  Award,
  ArrowRight,
  TrendingUp,
  Clock,
  CreditCard,
  Banknote,
  Smartphone,
} from "lucide-react";
import {
  initialOrders,
  initialProductInventory,
  initialIngredients,
  mockTopProducts,
  type PaymentMethod,
  type OrderStatus,
} from "@/data/admin-mock";
import { StatCard } from "@/components/admin/StatCard";
import { SalesChart } from "@/components/admin/SalesChart";

export default function AdminDashboardPage() {
  // Aggregate summary data
  const todaysSales = "$625.00";
  const todaysOrdersCount = 54;
  const bestSeller = mockTopProducts[0]?.name || "Velvet Flat White";

  // Compute all low-stock items across products & ingredients
  const lowStockProducts = initialProductInventory
    .filter((p) => p.quantity <= p.lowStockThreshold)
    .map((p) => ({
      id: p.id,
      name: p.name,
      type: "Product",
      current: p.quantity,
      unit: p.unit,
      threshold: p.lowStockThreshold,
    }));

  const lowStockIngredients = initialIngredients
    .filter((i) => i.quantity <= i.lowStockThreshold)
    .map((i) => ({
      id: i.id,
      name: i.name,
      type: "Ingredient",
      current: i.quantity,
      unit: i.unit,
      threshold: i.lowStockThreshold,
    }));

  const allLowStock = [...lowStockProducts, ...lowStockIngredients];
  const lowStockCount = allLowStock.length;

  // Recent 5 orders
  const recentOrders = initialOrders.slice(0, 5);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Pending":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Cancelled":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-cream text-mocha border-caramel/25";
    }
  };

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method) {
      case "Card":
        return <CreditCard className="w-3.5 h-3.5 text-mocha" />;
      case "Cash":
        return <Banknote className="w-3.5 h-3.5 text-mocha" />;
      case "Mobile money":
        return <Smartphone className="w-3.5 h-3.5 text-mocha" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Title & Date Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-espresso font-normal tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-mocha mt-1 font-sans">
            Today&apos;s operations, sales activity, and inventory health.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-warm-white border border-caramel/20 text-xs font-sans text-mocha">
          <Clock className="w-3.5 h-3.5 text-caramel" />
          <span>Tuesday, Nov 17 · Shift Live</span>
        </div>
      </div>

      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Today's Sales"
          value={todaysSales}
          subtitle="+14.2% vs yesterday"
          icon={DollarSign}
          badge={{ text: "Daily Total", variant: "success" }}
        />
        <StatCard
          title="Orders Today"
          value={`${todaysOrdersCount}`}
          subtitle="Avg. $11.57 / ticket"
          icon={ShoppingBag}
          badge={{ text: "Counter", variant: "neutral" }}
        />
        <StatCard
          title="Low Stock Items"
          value={`${lowStockCount}`}
          subtitle="Below safety buffer"
          icon={AlertTriangle}
          badge={{
            text: lowStockCount > 0 ? "Action needed" : "Healthy",
            variant: lowStockCount > 0 ? "warning" : "success",
          }}
        />
        <StatCard
          title="Top Seller Today"
          value={bestSeller}
          subtitle="138 cups served"
          icon={Award}
          badge={{ text: "No. 1 Item", variant: "neutral" }}
        />
      </div>

      {/* 2. 7-Day Sales Trend Chart Card */}
      <div className="bg-warm-white rounded-2xl p-5 sm:p-6 border border-caramel/20 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-caramel" />
              <h2 className="text-sm font-semibold text-espresso uppercase tracking-wider font-sans">
                Weekly Revenue (Last 7 Days)
              </h2>
            </div>
            <p className="text-xs text-mocha mt-0.5">
              Daily counter gross sales performance
            </p>
          </div>
          <div className="text-right">
            <span className="text-xl sm:text-2xl font-bold text-espresso font-sans">
              $4,640.00
            </span>
            <span className="block text-[11px] text-emerald-700 font-medium">
              +9.4% week-over-week
            </span>
          </div>
        </div>

        <SalesChart />
      </div>

      {/* 3. Recent Orders & Low-Stock Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders List */}
        <div className="bg-warm-white rounded-2xl p-5 sm:p-6 border border-caramel/20 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-espresso uppercase tracking-wider font-sans">
                  Recent Orders
                </h2>
                <p className="text-xs text-mocha mt-0.5">
                  Latest tickets recorded at counter
                </p>
              </div>
              <Link
                href="/admin/dashboard/orders"
                className="inline-flex items-center gap-1 text-xs text-caramel hover:text-caramel-dark font-medium transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-caramel/10">
              {recentOrders.map((order) => {
                const totalItemCount = order.items.reduce(
                  (sum, i) => sum + i.quantity,
                  0
                );
                const itemsSummary = order.items
                  .map((i) => `${i.quantity}x ${i.productName}`)
                  .join(", ");

                return (
                  <div
                    key={order.id}
                    className="py-3 sm:py-3.5 flex items-center justify-between gap-3 text-xs font-sans"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-espresso">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-mocha/80 text-[11px] truncate mt-0.5" title={itemsSummary}>
                        {totalItemCount} {totalItemCount === 1 ? "item" : "items"} · {itemsSummary}
                      </p>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end">
                      <span className="font-semibold text-espresso text-sm">
                        ${order.total.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-mocha mt-0.5">
                        {getPaymentIcon(order.paymentMethod)}
                        <span>{order.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-caramel/10 text-center">
            <Link
              href="/admin/dashboard/orders"
              className="text-xs text-mocha hover:text-espresso font-medium inline-flex items-center gap-1"
            >
              Go to Point of Sale & Orders <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Low-Stock Alert List */}
        <div className="bg-warm-white rounded-2xl p-5 sm:p-6 border border-caramel/20 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-espresso uppercase tracking-wider font-sans">
                  Low-Stock Alerts
                </h2>
                <p className="text-xs text-mocha mt-0.5">
                  Items below safety reorder threshold
                </p>
              </div>
              <Link
                href="/admin/dashboard/inventory"
                className="inline-flex items-center gap-1 text-xs text-caramel hover:text-caramel-dark font-medium transition-colors"
              >
                <span>Inventory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {allLowStock.length === 0 ? (
              <div className="py-8 text-center text-xs text-mocha">
                All inventory levels are currently above reorder thresholds.
              </div>
            ) : (
              <div className="divide-y divide-caramel/10">
                {allLowStock.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 sm:py-3.5 flex items-center justify-between gap-3 text-xs font-sans"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-espresso truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-mocha/70 px-1.5 py-0.5 rounded bg-cream border border-caramel/15 shrink-0">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-mocha/80 mt-0.5">
                        Threshold: {item.threshold} {item.unit}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>
                          {item.current} {item.unit} left
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-caramel/10 text-center">
            <Link
              href="/admin/dashboard/inventory"
              className="text-xs text-mocha hover:text-espresso font-medium inline-flex items-center gap-1"
            >
              Adjust stock & view logs <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
