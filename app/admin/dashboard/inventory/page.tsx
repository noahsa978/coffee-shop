"use client";

import { useState, useMemo } from "react";
import {
  Boxes,
  Layers,
  Search,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  History,
  TrendingDown,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  initialProductInventory,
  initialIngredients,
  initialStockChanges,
  type ProductStockItem,
  type Ingredient,
  type StockChange,
} from "@/data/admin-mock";
import { StockAdjustDialog } from "@/components/admin/StockAdjustDialog";

export default function AdminInventoryPage() {
  const [activeTab, setActiveTab] = useState<"products" | "ingredients">(
    "products"
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Inventory state
  const [productItems, setProductItems] = useState<ProductStockItem[]>(
    initialProductInventory
  );
  const [ingredientItems, setIngredientItems] =
    useState<Ingredient[]>(initialIngredients);
  const [changeHistory, setChangeHistory] =
    useState<StockChange[]>(initialStockChanges);

  // Modal state
  const [selectedItemForAdjust, setSelectedItemForAdjust] = useState<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
    type: "product" | "ingredient";
  } | null>(null);

  // Compute overall health metrics
  const lowStockProductsCount = useMemo(() => {
    return productItems.filter((p) => p.quantity <= p.lowStockThreshold).length;
  }, [productItems]);

  const lowStockIngredientsCount = useMemo(() => {
    return ingredientItems.filter((i) => i.quantity <= i.lowStockThreshold)
      .length;
  }, [ingredientItems]);

  const totalLowStock = lowStockProductsCount + lowStockIngredientsCount;

  // Filtered lists
  const filteredProducts = useMemo(() => {
    return productItems.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [productItems, searchQuery]);

  const filteredIngredients = useMemo(() => {
    return ingredientItems.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [ingredientItems, searchQuery]);

  // Handle stock adjustments
  const handleApplyAdjustment = (
    itemId: string,
    itemType: "product" | "ingredient",
    delta: number,
    reason: string
  ) => {
    let itemName = "";

    if (itemType === "product") {
      setProductItems((prev) =>
        prev.map((p) => {
          if (p.id === itemId) {
            itemName = p.name;
            const updated = Math.max(0, p.quantity + delta);
            return { ...p, quantity: updated };
          }
          return p;
        })
      );
    } else {
      setIngredientItems((prev) =>
        prev.map((ing) => {
          if (ing.id === itemId) {
            itemName = ing.name;
            const updated = Math.max(0, ing.quantity + delta);
            return { ...ing, quantity: updated };
          }
          return ing;
        })
      );
    }

    // Append to stock changes history
    const newChange: StockChange = {
      id: `chg-${Date.now()}`,
      itemName: itemName || "Inventory Item",
      change: delta,
      reason,
      createdAt: new Date().toISOString(),
    };

    setChangeHistory((prev) => [newChange, ...prev]);
  };

  return (
    <div className="space-y-6 sm:space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-espresso font-normal tracking-tight">
            Inventory & Stocks
          </h1>
          <p className="text-xs sm:text-sm text-mocha mt-1">
            Track baked goods and raw pantry goods with safety reorder thresholds.
          </p>
        </div>

        {/* Low Stock Indicator Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-warm-white border border-caramel/20 self-start sm:self-auto text-xs font-sans">
          <AlertTriangle
            className={`w-4 h-4 ${
              totalLowStock > 0 ? "text-amber-600" : "text-emerald-600"
            }`}
          />
          <span className="text-espresso font-medium">
            {totalLowStock > 0
              ? `${totalLowStock} items below reorder buffer`
              : "All stock levels healthy"}
          </span>
        </div>
      </div>

      {/* Main Grid: Inventory Table (Left/Top) + Adjustments History (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Inventory Management Table (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Tab Selector & Search Header */}
          <div className="bg-warm-white p-4 rounded-2xl border border-caramel/20 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Two Tabs */}
            <div className="flex items-center gap-1.5 bg-cream/70 p-1 rounded-xl border border-caramel/20">
              <button
                type="button"
                onClick={() => setActiveTab("products")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === "products"
                    ? "bg-caramel text-warm-white shadow-xs"
                    : "text-mocha hover:text-espresso"
                }`}
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>Finished Products</span>
                {lowStockProductsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                    {lowStockProductsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ingredients")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === "ingredients"
                    ? "bg-caramel text-warm-white shadow-xs"
                    : "text-mocha hover:text-espresso"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Ingredients</span>
                {lowStockIngredientsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                    {lowStockIngredientsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-mocha/60">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-caramel/25 bg-cream/30 text-xs text-espresso placeholder:text-mocha/40 focus:outline-none focus:ring-2 focus:ring-caramel"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-warm-white rounded-2xl border border-caramel/20 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-espresso border-collapse">
                <thead>
                  <tr className="border-b border-caramel/15 bg-cream/50 text-[11px] uppercase tracking-wider text-mocha font-semibold">
                    <th scope="col" className="py-3 px-4 sm:px-6">
                      Item Name
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Current Quantity
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Threshold
                    </th>
                    <th scope="col" className="py-3 px-4 text-center">
                      Status
                    </th>
                    <th scope="col" className="py-3 px-4 sm:px-6 text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-caramel/10">
                  {activeTab === "products" ? (
                    filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-xs text-mocha">
                          No finished products match your search.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => {
                        const isLow = prod.quantity <= prod.lowStockThreshold;
                        return (
                          <tr
                            key={prod.id}
                            className="hover:bg-cream/40 transition-colors"
                          >
                            <td className="py-3.5 px-4 sm:px-6">
                              <span className="font-medium text-espresso block">
                                {prod.name}
                              </span>
                              <span className="text-[11px] text-mocha">
                                {prod.category}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 font-semibold text-espresso">
                              {prod.quantity} {prod.unit}
                            </td>

                            <td className="py-3.5 px-4 text-mocha">
                              {prod.lowStockThreshold} {prod.unit}
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              {isLow ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                                  <span>Low stock</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Adequate</span>
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 sm:px-6 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedItemForAdjust({
                                    id: prod.id,
                                    name: prod.name,
                                    quantity: prod.quantity,
                                    unit: prod.unit,
                                    type: "product",
                                  })
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-caramel/25 text-xs font-medium text-mocha hover:text-caramel hover:bg-cream transition-colors cursor-pointer"
                              >
                                <SlidersHorizontal className="w-3 h-3" />
                                <span>Adjust</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )
                  ) : filteredIngredients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-xs text-mocha">
                        No raw ingredients match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredIngredients.map((ing) => {
                      const isLow = ing.quantity <= ing.lowStockThreshold;
                      return (
                        <tr
                          key={ing.id}
                          className="hover:bg-cream/40 transition-colors"
                        >
                          <td className="py-3.5 px-4 sm:px-6">
                            <span className="font-medium text-espresso block">
                              {ing.name}
                            </span>
                            <span className="text-[11px] text-mocha">
                              Raw Ingredient
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-espresso">
                            {ing.quantity} {ing.unit}
                          </td>

                          <td className="py-3.5 px-4 text-mocha">
                            {ing.lowStockThreshold} {ing.unit}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            {isLow ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                <span>Low stock</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Adequate</span>
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 sm:px-6 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedItemForAdjust({
                                  id: ing.id,
                                  name: ing.name,
                                  quantity: ing.quantity,
                                  unit: ing.unit,
                                  type: "ingredient",
                                })
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-caramel/25 text-xs font-medium text-mocha hover:text-caramel hover:bg-cream transition-colors cursor-pointer"
                            >
                              <SlidersHorizontal className="w-3 h-3" />
                              <span>Adjust</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Stock Adjustments History Feed (4 cols on lg) */}
        <div className="lg:col-span-4 bg-warm-white rounded-2xl border border-caramel/20 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-caramel/15">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-caramel" />
              <h2 className="font-serif text-lg text-espresso font-normal">
                Adjustment Log
              </h2>
            </div>
            <span className="text-[11px] text-mocha">
              {changeHistory.length} recorded
            </span>
          </div>

          <div className="divide-y divide-caramel/10 max-h-[500px] overflow-y-auto space-y-2">
            {changeHistory.map((item) => {
              const isPositive = item.change > 0;
              const dateStr = new Date(item.createdAt).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }
              );

              return (
                <div key={item.id} className="pt-2.5 pb-2 text-xs font-sans">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-espresso">
                      {item.itemName}
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 font-bold ${
                        isPositive ? "text-emerald-700" : "text-amber-700"
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>
                        {isPositive ? `+${item.change}` : item.change}
                      </span>
                    </span>
                  </div>

                  <p className="text-[11px] text-mocha/90 mt-0.5">
                    Reason: {item.reason}
                  </p>

                  <div className="flex items-center gap-1 text-[10px] text-mocha/60 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{dateStr}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-mocha/60 border-t border-caramel/10 pt-3 text-center">
            Automatic inventory deduction logic upon counter order completion is reserved for backend workflow integration.
          </p>
        </div>
      </div>

      {/* Adjust Stock Dialog */}
      <StockAdjustDialog
        key={selectedItemForAdjust ? selectedItemForAdjust.id : "no-item"}
        item={selectedItemForAdjust}
        isOpen={!!selectedItemForAdjust}
        onClose={() => setSelectedItemForAdjust(null)}
        onApplyAdjustment={handleApplyAdjustment}
      />
    </div>
  );
}
