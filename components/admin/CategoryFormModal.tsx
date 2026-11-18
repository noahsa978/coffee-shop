"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Category } from "@/data/admin-mock";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: Omit<Category, "id"> & { id?: string }) => void;
  initialCategory?: Category | null;
  suggestedDisplayOrder?: number;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSave,
  initialCategory,
  suggestedDisplayOrder = 1,
}: CategoryFormModalProps) {
  const [name, setName] = useState(initialCategory?.name || "");
  const [displayOrder, setDisplayOrder] = useState(
    initialCategory
      ? initialCategory.displayOrder.toString()
      : suggestedDisplayOrder.toString()
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Category name is required.";
    }

    const orderNum = parseInt(displayOrder, 10);
    if (isNaN(orderNum) || orderNum <= 0) {
      newErrors.displayOrder = "Display order must be a positive number.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: initialCategory?.id,
      name: name.trim(),
      displayOrder: orderNum,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-form-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-warm-white rounded-2xl border border-caramel/25 shadow-2xl p-6 z-10 font-sans animate-fade-in">
        <div className="flex items-center justify-between pb-4 border-b border-caramel/15">
          <div>
            <h2
              id="category-form-title"
              className="font-serif text-xl sm:text-2xl font-normal text-espresso"
            >
              {initialCategory ? "Edit Category" : "Add Category"}
            </h2>
            <p className="text-xs text-mocha mt-0.5">
              Categories determine menu grouping and tab order.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-mocha hover:text-espresso hover:bg-cream transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label
              htmlFor="cat-name"
              className="block text-xs font-medium text-espresso"
            >
              Category Name *
            </label>
            <input
              id="cat-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="e.g. Signature Cakes"
              className="w-full px-3.5 py-2 rounded-xl border border-caramel/25 bg-cream/30 text-espresso text-sm placeholder:text-mocha/40 focus:outline-none focus:ring-2 focus:ring-caramel"
            />
            {errors.name && (
              <p className="text-[11px] text-red-600 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          {/* Display Order */}
          <div className="space-y-1">
            <label
              htmlFor="cat-order"
              className="block text-xs font-medium text-espresso"
            >
              Display Order *
            </label>
            <input
              id="cat-order"
              type="number"
              min="1"
              value={displayOrder}
              onChange={(e) => {
                setDisplayOrder(e.target.value);
                if (errors.displayOrder)
                  setErrors((prev) => ({ ...prev, displayOrder: "" }));
              }}
              placeholder="1"
              className="w-full px-3.5 py-2 rounded-xl border border-caramel/25 bg-cream/30 text-espresso text-sm placeholder:text-mocha/40 focus:outline-none focus:ring-2 focus:ring-caramel"
            />
            <p className="text-[10px] text-mocha/70">
              Determines horizontal tab position on the public customer menu (1 = first tab).
            </p>
            {errors.displayOrder && (
              <p className="text-[11px] text-red-600 font-medium">
                {errors.displayOrder}
              </p>
            )}
          </div>

          {/* Action buttons */}
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
              {initialCategory ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
