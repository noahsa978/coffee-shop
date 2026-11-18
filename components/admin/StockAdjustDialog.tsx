"use client";

import { useState } from "react";
import { X, Plus, Minus, AlertCircle } from "lucide-react";

interface AdjustItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  type: "product" | "ingredient";
}

interface StockAdjustDialogProps {
  item: AdjustItem | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyAdjustment: (
    itemId: string,
    itemType: "product" | "ingredient",
    delta: number,
    reason: string
  ) => void;
}

export function StockAdjustDialog({
  item,
  isOpen,
  onClose,
  onApplyAdjustment,
}: StockAdjustDialogProps) {
  const [direction, setDirection] = useState<"add" | "remove">("add");
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid positive quantity.");
      return;
    }

    if (!reason.trim()) {
      setError("Please provide a brief reason for this stock adjustment.");
      return;
    }

    const delta = direction === "add" ? parsedAmount : -parsedAmount;

    // Check if removing more than available
    if (direction === "remove" && parsedAmount > item.quantity) {
      setError(
        `Cannot remove ${parsedAmount} ${item.unit}. Current stock is only ${item.quantity} ${item.unit}.`
      );
      return;
    }

    onApplyAdjustment(item.id, item.type, delta, reason.trim());
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="stock-adjust-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto font-sans"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-warm-white rounded-2xl border border-caramel/25 shadow-2xl p-6 z-10 animate-fade-in">
        <div className="flex items-start justify-between pb-4 border-b border-caramel/15">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-caramel font-semibold">
              Manual Stock Adjustment
            </span>
            <h2
              id="stock-adjust-title"
              className="font-serif text-xl sm:text-2xl font-normal text-espresso"
            >
              {item.name}
            </h2>
            <p className="text-xs text-mocha mt-0.5">
              Current level: <span className="font-semibold text-espresso">{item.quantity} {item.unit}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-mocha hover:text-espresso hover:bg-cream transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Adjustment Direction Toggle */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-espresso">
              Adjustment Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection("add")}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  direction === "add"
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                    : "bg-cream/40 text-mocha border-caramel/20 hover:bg-cream"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stock (+)</span>
              </button>

              <button
                type="button"
                onClick={() => setDirection("remove")}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  direction === "remove"
                    ? "bg-amber-700 text-white border-amber-700 shadow-xs"
                    : "bg-cream/40 text-mocha border-caramel/20 hover:bg-cream"
                }`}
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Remove Stock (-)</span>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-1">
            <label
              htmlFor="adjust-amount"
              className="block text-xs font-medium text-espresso"
            >
              Quantity to {direction === "add" ? "add" : "remove"} ({item.unit}) *
            </label>
            <input
              id="adjust-amount"
              type="number"
              step="any"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`e.g. 5 ${item.unit}`}
              className="w-full px-3.5 py-2 rounded-xl border border-caramel/25 bg-cream/30 text-espresso text-sm placeholder:text-mocha/40 focus:outline-none focus:ring-2 focus:ring-caramel"
            />
          </div>

          {/* Reason Input */}
          <div className="space-y-1">
            <label
              htmlFor="adjust-reason"
              className="block text-xs font-medium text-espresso"
            >
              Reason for Adjustment *
            </label>
            <input
              id="adjust-reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Morning delivery, Quality discard, Inventory count"
              className="w-full px-3.5 py-2 rounded-xl border border-caramel/25 bg-cream/30 text-espresso text-sm placeholder:text-mocha/40 focus:outline-none focus:ring-2 focus:ring-caramel"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-caramel/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-caramel/25 text-xs sm:text-sm font-medium text-mocha hover:text-espresso hover:bg-cream transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-caramel text-warm-white text-xs sm:text-sm font-medium hover:bg-caramel-dark transition-colors cursor-pointer shadow-xs"
            >
              Record Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
