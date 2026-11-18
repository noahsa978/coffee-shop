"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Eye,
  CreditCard,
  Banknote,
  Smartphone,
  ShoppingBag,
  DollarSign,
  Clock,
} from "lucide-react";
import {
  initialOrders,
  type Order,
  type PaymentMethod,
  type OrderStatus,
  ORDER_STATUSES,
  PAYMENT_METHODS,
} from "@/data/admin-mock";
import { CAFE_CONFIG } from "@/data/menu";
import { OrderBuilder } from "@/components/admin/OrderBuilder";
import { OrderDetailModal } from "@/components/admin/OrderDetailModal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Generate next order number
  const nextOrderNumber = useMemo(() => {
    const highestNum = orders.reduce((max, o) => {
      const num = parseInt(o.orderNumber.replace("#", ""), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 1000);
    return `#${highestNum + 1}`;
  }, [orders]);

  // Aggregate metrics
  const totalVolume = useMemo(() => {
    return orders
      .filter((o) => o.status === "Completed")
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const pendingCount = useMemo(() => {
    return orders.filter((o) => o.status === "Pending").length;
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        order.items.some((item) =>
          item.productName.toLowerCase().includes(searchQuery.toLowerCase().trim())
        );

      const matchesPayment =
        selectedPayment === "all" || order.paymentMethod === selectedPayment;

      const matchesStatus =
        selectedStatus === "all" || order.status === selectedStatus;

      return matchesSearch && matchesPayment && matchesStatus;
    });
  }, [orders, searchQuery, selectedPayment, selectedStatus]);

  // Add new order
  const handleCreateOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setIsCreatingOrder(false);
  };

  // Status update
  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

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

  // If staff clicked "New Counter Order", render the Point-of-Sale Builder
  if (isCreatingOrder) {
    return (
      <OrderBuilder
        nextOrderNumber={nextOrderNumber}
        onCancel={() => setIsCreatingOrder(false)}
        onSubmitOrder={handleCreateOrder}
      />
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-espresso font-normal tracking-tight">
            Orders & Counter Tickets
          </h1>
          <p className="text-xs sm:text-sm text-mocha mt-1">
            Staff counter register tickets, payment records, and customer fulfillment.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreatingOrder(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-caramel text-warm-white text-xs sm:text-sm font-medium hover:bg-caramel-dark active:scale-[0.99] transition-all cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Counter Order</span>
        </button>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-warm-white border border-caramel/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-mocha font-semibold">
              Total Tickets
            </span>
            <p className="text-xl font-bold text-espresso mt-0.5">
              {orders.length}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-caramel">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-warm-white border border-caramel/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-mocha font-semibold">
              Completed Gross
            </span>
            <p className="text-xl font-bold text-espresso mt-0.5">
              {CAFE_CONFIG.currencySymbol}
              {totalVolume.toFixed(2)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-emerald-700">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-warm-white border border-caramel/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-mocha font-semibold">
              Pending Tickets
            </span>
            <p className="text-xl font-bold text-espresso mt-0.5">
              {pendingCount}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-amber-600">
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-warm-white p-4 rounded-2xl border border-caramel/20 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-mocha/60">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ticket # or item name..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-caramel/25 bg-cream/30 text-xs sm:text-sm text-espresso placeholder:text-mocha/40 focus:outline-none focus:ring-2 focus:ring-caramel"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Payment Method Filter */}
          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="px-3 py-2 rounded-xl border border-caramel/25 bg-cream/30 text-xs sm:text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-caramel cursor-pointer"
            aria-label="Filter by payment method"
          >
            <option value="all">All Payments</option>
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm} value={pm}>
                {pm}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-caramel/25 bg-cream/30 text-xs sm:text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-caramel cursor-pointer"
            aria-label="Filter by order status"
          >
            <option value="all">All Statuses</option>
            {ORDER_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-warm-white rounded-2xl border border-caramel/20 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-cream border border-caramel/25 flex items-center justify-center text-caramel mx-auto mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg text-espresso">No orders found</h3>
            <p className="text-xs text-mocha mt-1 max-w-sm mx-auto">
              No counter tickets match the current search or filter options.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-espresso border-collapse">
              <thead>
                <tr className="border-b border-caramel/15 bg-cream/50 text-[11px] uppercase tracking-wider text-mocha font-semibold">
                  <th scope="col" className="py-3 px-4 sm:px-6">
                    Ticket #
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Time
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Items Summary
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Payment
                  </th>
                  <th scope="col" className="py-3 px-4 text-center">
                    Status
                  </th>
                  <th scope="col" className="py-3 px-4 text-right">
                    Total
                  </th>
                  <th scope="col" className="py-3 px-4 sm:px-6 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-caramel/10">
                {filteredOrders.map((order) => {
                  const totalItems = order.items.reduce(
                    (sum, i) => sum + i.quantity,
                    0
                  );
                  const itemsPreview = order.items
                    .map((i) => `${i.quantity}x ${i.productName}`)
                    .join(", ");

                  const timeStr = new Date(order.createdAt).toLocaleTimeString(
                    "en-US",
                    { hour: "numeric", minute: "2-digit", hour12: true }
                  );

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-cream/40 transition-colors"
                    >
                      {/* Order Number */}
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-espresso">
                        {order.orderNumber}
                      </td>

                      {/* Time */}
                      <td className="py-3.5 px-4 text-mocha whitespace-nowrap">
                        {timeStr}
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4 max-w-xs truncate" title={itemsPreview}>
                        <span className="font-medium text-espresso">
                          {totalItems} {totalItems === 1 ? "item" : "items"}
                        </span>
                        <span className="text-mocha/80 block text-[11px] truncate">
                          {itemsPreview}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream border border-caramel/20 text-xs text-espresso">
                          {getPaymentIcon(order.paymentMethod)}
                          <span>{order.paymentMethod}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-right font-semibold text-caramel">
                        {CAFE_CONFIG.currencySymbol}
                        {order.total.toFixed(2)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-caramel/25 text-xs font-medium text-mocha hover:text-caramel hover:bg-cream transition-colors cursor-pointer"
                          aria-label={`View ticket ${order.orderNumber}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedOrder(null);
        }}
        onStatusChange={handleUpdateStatus}
      />
    </div>
  );
}
