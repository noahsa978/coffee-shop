"use client";

import { X, Calendar, CreditCard, Banknote, Smartphone } from "lucide-react";
import type { Order, PaymentMethod, OrderStatus } from "@/data/admin-mock";
import { CAFE_CONFIG } from "@/data/menu";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
}

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onStatusChange,
}: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  const formattedDate = new Date(order.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method) {
      case "Card":
        return <CreditCard className="w-4 h-4 text-mocha" />;
      case "Cash":
        return <Banknote className="w-4 h-4 text-mocha" />;
      case "Mobile money":
        return <Smartphone className="w-4 h-4 text-mocha" />;
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-warm-white rounded-2xl border border-caramel/25 shadow-2xl p-5 sm:p-7 z-10 animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-caramel/15">
          <div>
            <div className="flex items-center gap-2.5">
              <h2
                id="order-detail-title"
                className="font-serif text-xl sm:text-2xl font-normal text-espresso"
              >
                Ticket {order.orderNumber}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-mocha mt-1">
              <Calendar className="w-3.5 h-3.5 text-caramel" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-mocha hover:text-espresso hover:bg-cream transition-colors cursor-pointer"
            aria-label="Close ticket details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Meta Info */}
        <div className="my-4 p-3.5 rounded-xl bg-cream/40 border border-caramel/15 flex items-center justify-between text-xs">
          <div>
            <span className="text-mocha block text-[11px] uppercase tracking-wider font-medium">
              Payment Method
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-espresso mt-0.5">
              {getPaymentIcon(order.paymentMethod)}
              <span>{order.paymentMethod} (Counter manual entry)</span>
            </div>
          </div>

          {/* Quick status change */}
          {onStatusChange && (
            <div className="text-right">
              <label htmlFor="modal-status-select" className="text-mocha block text-[11px] uppercase tracking-wider font-medium mb-0.5">
                Update Status
              </label>
              <select
                id="modal-status-select"
                value={order.status}
                onChange={(e) =>
                  onStatusChange(order.id, e.target.value as OrderStatus)
                }
                className="px-2 py-1 rounded-lg border border-caramel/25 bg-warm-white text-xs text-espresso font-medium focus:outline-none focus:ring-1 focus:ring-caramel cursor-pointer"
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          )}
        </div>

        {/* Line Items List: shows unit price and product name AS THEY WERE at purchase time */}
        <div className="space-y-2 mt-5">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-mocha">
            Ticket Line Items
          </h3>
          <div className="divide-y divide-caramel/10 border border-caramel/15 rounded-xl overflow-hidden bg-warm-white">
            {order.items.map((item, idx) => {
              const lineTotal = item.unitPrice * item.quantity;
              return (
                <div
                  key={idx}
                  className="p-3 flex items-center justify-between text-xs sm:text-sm hover:bg-cream/30"
                >
                  <div className="flex-1 pr-4">
                    <p className="font-medium text-espresso">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-mocha/80 mt-0.5">
                      {item.quantity} × {CAFE_CONFIG.currencySymbol}
                      {item.unitPrice.toFixed(2)} (locked at time of order)
                    </p>
                  </div>
                  <div className="font-semibold text-espresso">
                    {CAFE_CONFIG.currencySymbol}
                    {lineTotal.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total Summary */}
        <div className="mt-5 pt-4 border-t border-caramel/15 space-y-1.5 text-xs sm:text-sm">
          <div className="flex justify-between text-mocha">
            <span>Subtotal</span>
            <span>
              {CAFE_CONFIG.currencySymbol}
              {order.total.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-mocha">
            <span>Taxes Included</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between text-base font-bold text-espresso pt-2 border-t border-caramel/10">
            <span>Total Paid</span>
            <span className="text-caramel font-sans">
              {CAFE_CONFIG.currencySymbol}
              {order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-6 pt-4 border-t border-caramel/15 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-caramel text-warm-white text-xs sm:text-sm font-medium hover:bg-caramel-dark transition-colors cursor-pointer shadow-xs"
          >
            Close Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
