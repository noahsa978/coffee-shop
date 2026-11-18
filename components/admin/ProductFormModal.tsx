"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Sparkles, Image as ImageIcon } from "lucide-react";
import {
  type Product,
  type Category,
  ADMIN_FEATURE_FLAGS,
} from "@/data/admin-mock";
import { WARM_PLACEHOLDER_BLUR } from "@/data/menu";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, "id"> & { id?: string }) => void;
  categories: Category[];
  initialProduct?: Product | null;
}

export function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  categories,
  initialProduct,
}: ProductFormModalProps) {
  // State initialized directly from initialProduct (no useEffect cascading renders)
  const [name, setName] = useState(initialProduct?.name || "");
  const [categoryId, setCategoryId] = useState(
    initialProduct?.categoryId || categories[0]?.id || "coffee"
  );
  const [price, setPrice] = useState(
    initialProduct ? initialProduct.price.toString() : ""
  );
  const [imageUrl, setImageUrl] = useState(
    initialProduct?.imageUrl ||
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
  );
  const [isAvailable, setIsAvailable] = useState(
    initialProduct !== undefined && initialProduct !== null
      ? initialProduct.isAvailable
      : true
  );
  const [tag, setTag] = useState<"New" | "Popular" | null>(
    initialProduct?.tag || null
  );
  const [isFeatured, setIsFeatured] = useState(
    initialProduct?.isFeatured || false
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Product name is required.";
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      newErrors.price = "Please enter a valid positive price.";
    }
    if (!imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: initialProduct?.id,
      name: name.trim(),
      categoryId,
      price: parsedPrice,
      imageUrl: imageUrl.trim(),
      isAvailable,
      tag,
      isFeatured,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-form-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-warm-white rounded-2xl border border-caramel/25 shadow-2xl p-5 sm:p-7 z-10 font-sans max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-caramel/15">
          <div>
            <h2
              id="product-form-title"
              className="font-serif text-xl sm:text-2xl font-normal text-espresso"
            >
              {initialProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-xs text-mocha mt-0.5">
              Fill in product details for the café menu.
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
              htmlFor="prod-name"
              className="block text-xs font-medium text-espresso"
            >
              Item Name *
            </label>
            <input
              id="prod-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="e.g. Cardamom Honey Flat White"
              className="w-full px-3.5 py-2 rounded-xl border border-caramel/25 bg-cream/30 text-espresso text-sm placeholder:text-mocha/40 focus:outline-none focus:ring-2 focus:ring-caramel"
            />
            {errors.name && (
              <p className="text-[11px] text-red-600 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          {/* Category & Price in two columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label
                htmlFor="prod-category"
                className="block text-xs font-medium text-espresso"
              >
                Category *
              </label>
              <select
                id="prod-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-caramel/25 bg-cream/30 text-espresso text-sm focus:outline-none focus:ring-2 focus:ring-caramel"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="prod-price"
                className="block text-xs font-medium text-espresso"
              >
                Price ($) *
              </label>
              <input
                id="prod-price"
                type="number"
                step="0.05"
                min="0"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (errors.price)
                    setErrors((prev) => ({ ...prev, price: "" }));
                }}
                placeholder="4.75"
                className="w-full px-3.5 py-2 rounded-xl border border-caramel/25 bg-cream/30 text-espresso text-sm placeholder:text-mocha/40 focus:outline-none focus:ring-2 focus:ring-caramel"
              />
              {errors.price && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors.price}
                </p>
              )}
            </div>
          </div>

          {/* Image URL & Live Preview */}
          <div className="space-y-1.5">
            <label
              htmlFor="prod-image"
              className="block text-xs font-medium text-espresso"
            >
              Image URL *
            </label>
            <div className="flex gap-3 items-center">
              <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-cream border border-caramel/25 flex items-center justify-center">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    fill
                    placeholder="blur"
                    blurDataURL={WARM_PLACEHOLDER_BLUR}
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <ImageIcon className="w-5 h-5 text-mocha/50" />
                )}
              </div>
              <div className="flex-1">
                <input
                  id="prod-image"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (errors.imageUrl)
                      setErrors((prev) => ({ ...prev, imageUrl: "" }));
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-caramel/25 bg-cream/30 text-espresso text-xs focus:outline-none focus:ring-2 focus:ring-caramel"
                />
                <p className="text-[10px] text-mocha/70 mt-1">
                  Plain URL string. Image hosting (Drive, CDN, /public) is configurable.
                </p>
              </div>
            </div>
            {errors.imageUrl && (
              <p className="text-[11px] text-red-600 font-medium">
                {errors.imageUrl}
              </p>
            )}
          </div>

          {/* Tag Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-espresso">
              Promotional Tag (Optional)
            </label>
            <div className="flex gap-2">
              {[
                { label: "None", value: null },
                { label: "Popular", value: "Popular" },
                { label: "New", value: "New" },
              ].map((item) => {
                const isSelected = tag === item.value;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setTag(item.value as "New" | "Popular" | null)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-caramel text-warm-white border-caramel shadow-xs"
                        : "bg-cream/40 text-mocha border-caramel/20 hover:bg-cream"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="p-3 rounded-xl bg-cream/40 border border-caramel/15 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-espresso">
                Item Availability
              </p>
              <p className="text-[11px] text-mocha">
                {isAvailable
                  ? "Available to order on customer menu"
                  : "Marked as Sold Out on customer menu"}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-mocha/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-warm-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-warm-white after:border-caramel/30 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-caramel" />
            </label>
          </div>

          {/* Optional "Featured in banner" toggle behind feature flag */}
          {ADMIN_FEATURE_FLAGS.showFeaturedInBannerToggle && (
            <div className="p-3 rounded-xl bg-caramel/10 border border-caramel/20 flex items-center justify-between">
              <div className="pr-4">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-caramel" />
                  <p className="text-xs font-semibold text-espresso">
                    Feature in Hero Banner
                  </p>
                </div>
                <p className="text-[11px] text-mocha mt-0.5">
                  Includes this item in the public café specials slideshow.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-mocha/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-warm-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-warm-white after:border-caramel/30 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-caramel" />
              </label>
            </div>
          )}

          {/* Action Buttons */}
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
              {initialProduct ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
