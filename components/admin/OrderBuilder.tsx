"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  X,
  Coffee,
} from "lucide-react";
import {
  initialAdminProducts,
  initialAdminCategories,
  type Product,
  type Order,
  type PaymentMethod,
} from "@/data/admin-mock";
import { CAFE_CONFIG, WARM_PLACEHOLDER_BLUR } from "@/data/menu";

interface OrderBuilderProps {
  onCancel: () => void;
  onSubmitOrder: (newOrder: Order) => void;
  nextOrderNumber: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

function OrderProductImage({
  imageUrl,
  name,
}: {
  imageUrl: string;
  name: string;
}) {
  const [error, setError] = useState(false);

  return (
    <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-cream border border-caramel/15 aspect-square flex items-center justify-center">
      {!error && imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          placeholder="blur"
          blurDataURL={WARM_PLACEHOLDER_BLUR}
          onError={() => setError(true)}
          className="object-cover"
          sizes="56px"
        />
      ) : (
        <Coffee className="w-6 h-6 text-caramel/70" />
      )}
    </div>
  );
}

export function OrderBuilder({
  onCancel,
  onSubmitOrder,
  nextOrderNumber,
}: OrderBuilderProps) {
  const products = initialAdminProducts;
  const categories = initialAdminCategories;

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Card");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered available products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesCategory =
        selectedCategory === "all" || prod.categoryId === selectedCategory;
      const matchesSearch = prod.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Add item to cart
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Decrement item
  const handleDecrement = (productId: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Running total calculation
  const totalAmount = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [cart]);

  const totalQuantity = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Submit order
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: nextOrderNumber,
      createdAt: new Date().toISOString(),
      status: "Completed",
      paymentMethod,
      total: totalAmount,
      items: cart.map((item) => ({
        productName: item.product.name,
        unitPrice: item.product.price,
        quantity: item.quantity,
      })),
    };

    setTimeout(() => {
      onSubmitOrder(newOrder);
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-caramel/15">
        <div>
          <span className="text-xs uppercase tracking-wider text-caramel font-semibold">
            Counter Point of Sale
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-espresso font-normal">
            New Counter Ticket {nextOrderNumber}
          </h1>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-caramel/25 text-xs text-mocha hover:text-espresso hover:bg-warm-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>

      {/* Main Grid: Catalog Left / Ticket Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Product Selection (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Tabs */}
          <div className="bg-warm-white p-3.5 sm:p-4 rounded-2xl border border-caramel/20 shadow-xs space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-mocha/60">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-caramel/25 bg-cream/30 text-xs sm:text-sm text-espresso placeholder:text-mocha/40 focus:outline-none focus:ring-2 focus:ring-caramel"
              />
            </div>

            {/* Category horizontal pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-caramel text-warm-white shadow-xs"
                    : "bg-cream/60 text-mocha hover:bg-cream"
                }`}
              >
                All Items
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === c.id
                      ? "bg-caramel text-warm-white shadow-xs"
                      : "bg-cream/60 text-mocha hover:bg-cream"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredProducts.map((prod) => {
              const isSoldOut = !prod.isAvailable;
              return (
                <div
                  key={prod.id}
                  className={`p-3 rounded-2xl bg-warm-white border border-caramel/15 shadow-xs flex items-center gap-3 transition-all ${
                    isSoldOut
                      ? "opacity-50 saturate-50"
                      : "hover:border-caramel/40"
                  }`}
                >
                  <OrderProductImage
                    imageUrl={prod.imageUrl}
                    name={prod.name}
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-xs sm:text-sm text-espresso truncate">
                      {prod.name}
                    </h3>
                    <p className="text-xs font-semibold text-caramel mt-0.5">
                      {CAFE_CONFIG.currencySymbol}
                      {prod.price.toFixed(2)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(prod)}
                    disabled={isSoldOut}
                    className="p-2 rounded-xl bg-cream hover:bg-caramel hover:text-warm-white text-espresso transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0 border border-caramel/20"
                    aria-label={`Add ${prod.name} to ticket`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Ticket Summary (5 cols) */}
        <div className="lg:col-span-5 bg-warm-white rounded-2xl border border-caramel/20 shadow-xs p-5 sm:p-6 space-y-5 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-caramel/15">
            <div>
              <h2 className="font-serif text-lg text-espresso font-normal">
                Counter Ticket
              </h2>
              <p className="text-[11px] text-mocha">
                {totalQuantity} {totalQuantity === 1 ? "item" : "items"} selected
              </p>
            </div>
            <span className="font-mono text-xs font-semibold text-caramel bg-cream px-2 py-1 rounded-lg border border-caramel/20">
              {nextOrderNumber}
            </span>
          </div>

          {/* Cart items list */}
          <div className="space-y-2 max-h-[260px] overflow-y-auto divide-y divide-caramel/10">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-xs text-mocha">
                <Coffee className="w-8 h-8 mx-auto text-caramel/40 mb-2" />
                <p>No items added to ticket yet.</p>
                <p className="text-[11px] text-mocha/70 mt-0.5">
                  Click items on the left to add them.
                </p>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="pt-2 flex items-center justify-between text-xs"
                >
                  <div className="flex-1 pr-2 truncate">
                    <p className="font-medium text-espresso truncate">
                      {product.name}
                    </p>
                    <p className="text-[11px] text-mocha">
                      {CAFE_CONFIG.currencySymbol}
                      {product.price.toFixed(2)} each
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 shrink-0 bg-cream/70 rounded-lg p-1 border border-caramel/20">
                    <button
                      type="button"
                      onClick={() => handleDecrement(product.id)}
                      className="p-1 rounded text-mocha hover:text-espresso hover:bg-cream"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-semibold text-espresso text-xs">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="p-1 rounded text-mocha hover:text-espresso hover:bg-cream"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="w-16 text-right font-semibold text-espresso pl-2">
                    {CAFE_CONFIG.currencySymbol}
                    {(product.price * quantity).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment Method Selector (Recorded manually by staff) */}
          <div className="space-y-2 pt-3 border-t border-caramel/15">
            <label className="block text-xs font-medium text-espresso">
              Payment Method (Recorded manually by staff)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { method: "Card" as PaymentMethod, icon: CreditCard },
                { method: "Cash" as PaymentMethod, icon: Banknote },
                { method: "Mobile money" as PaymentMethod, icon: Smartphone },
              ].map(({ method, icon: Icon }) => {
                const isSelected = paymentMethod === method;
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-1.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-caramel text-warm-white border-caramel shadow-xs"
                        : "bg-cream/40 text-mocha border-caramel/20 hover:bg-cream"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px] truncate">{method}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Total & Submit */}
          <div className="pt-3 border-t border-caramel/15 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-mocha">Total Due:</span>
              <span className="font-serif text-2xl font-bold text-espresso">
                {CAFE_CONFIG.currencySymbol}
                {totalAmount.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={cart.length === 0 || isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-caramel text-warm-white font-medium text-sm hover:bg-caramel-dark active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Recording ticket...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Order ({CAFE_CONFIG.currencySymbol}{totalAmount.toFixed(2)})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
