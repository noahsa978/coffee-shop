"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Coffee,
  Sparkles,
  Filter,
} from "lucide-react";
import {
  initialAdminProducts,
  initialAdminCategories,
  type Product,
} from "@/data/admin-mock";
import { WARM_PLACEHOLDER_BLUR } from "@/data/menu";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialAdminProducts);
  const categories = initialAdminCategories;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete confirmation dialog state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch = prod.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());
      const matchesCategory =
        selectedCategory === "all" || prod.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Toggle availability inline
  const handleToggleAvailability = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p
      )
    );
  };

  // Add / Edit save handler
  const handleSaveProduct = (
    productData: Omit<Product, "id"> & { id?: string }
  ) => {
    if (productData.id) {
      // Editing existing product
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productData.id ? ({ ...p, ...productData } as Product) : p
        )
      );
    } else {
      // Creating new product
      const newProduct: Product = {
        ...productData,
        id: `prod-${Date.now()}`,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
  };

  // Delete product handler
  const handleConfirmDelete = () => {
    if (productToDelete) {
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setProductToDelete(null);
    }
  };

  const getCategoryName = (catId: string) => {
    return categories.find((c) => c.id === catId)?.name || catId;
  };

  return (
    <div className="space-y-6 sm:space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-espresso font-normal tracking-tight">
            Menu Products
          </h1>
          <p className="text-xs sm:text-sm text-mocha mt-1">
            Manage café items, prices, tags, and daily inventory availability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingProduct(null);
            setIsFormModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-caramel text-warm-white text-xs sm:text-sm font-medium hover:bg-caramel-dark active:scale-[0.99] transition-all cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add product</span>
        </button>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-warm-white p-4 rounded-2xl border border-caramel/20 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-mocha/60">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-caramel/25 bg-cream/30 text-xs sm:text-sm text-espresso placeholder:text-mocha/40 focus:outline-none focus:ring-2 focus:ring-caramel"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-mocha shrink-0 hidden sm:inline" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-caramel/25 bg-cream/30 text-xs sm:text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-caramel cursor-pointer"
            aria-label="Filter products by category"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-warm-white rounded-2xl border border-caramel/20 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-cream border border-caramel/25 flex items-center justify-center text-caramel mx-auto mb-3">
              <Coffee className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg text-espresso">No products found</h3>
            <p className="text-xs text-mocha mt-1 max-w-sm mx-auto">
              No menu items match your search criteria. Try clearing the filter or search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-espresso border-collapse">
              <thead>
                <tr className="border-b border-caramel/15 bg-cream/50 text-[11px] uppercase tracking-wider text-mocha font-semibold">
                  <th scope="col" className="py-3 px-4 sm:px-6">
                    Item
                  </th>
                  <th scope="col" className="py-3 px-4 hidden md:table-cell">
                    Category
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Price
                  </th>
                  <th scope="col" className="py-3 px-4 hidden sm:table-cell">
                    Tag
                  </th>
                  <th scope="col" className="py-3 px-4 text-center">
                    Available
                  </th>
                  <th scope="col" className="py-3 px-4 sm:px-6 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-caramel/10">
                {filteredProducts.map((product) => {
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-cream/40 transition-colors"
                    >
                      {/* Thumbnail & Name */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-cream border border-caramel/15 aspect-square">
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              placeholder="blur"
                              blurDataURL={WARM_PLACEHOLDER_BLUR}
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div>
                            <span className="font-medium text-espresso block leading-snug">
                              {product.name}
                            </span>
                            <span className="text-[11px] text-mocha md:hidden">
                              {getCategoryName(product.categoryId)}
                            </span>
                            {product.isFeatured && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-caramel font-semibold mt-0.5">
                                <Sparkles className="w-3 h-3" /> Featured in banner
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 hidden md:table-cell text-mocha">
                        <span className="px-2.5 py-1 rounded-full bg-cream/70 border border-caramel/15 text-xs">
                          {getCategoryName(product.categoryId)}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-semibold text-caramel">
                        ${product.price.toFixed(2)}
                      </td>

                      {/* Tag */}
                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        {product.tag ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                              product.tag === "Popular"
                                ? "bg-caramel/15 text-caramel-dark border border-caramel/30"
                                : "bg-espresso/10 text-espresso border border-espresso/20"
                            }`}
                          >
                            {product.tag}
                          </span>
                        ) : (
                          <span className="text-mocha/40 text-xs">—</span>
                        )}
                      </td>

                      {/* Availability Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(product.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                            product.isAvailable
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                              : "bg-red-50 text-red-800 border-red-200 hover:bg-red-100"
                          }`}
                          title="Click to toggle availability on customer menu"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.isAvailable
                                ? "bg-emerald-600"
                                : "bg-red-600"
                            }`}
                          />
                          <span className="hidden sm:inline">
                            {product.isAvailable ? "Available" : "Sold out"}
                          </span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(product);
                              setIsFormModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-mocha hover:text-caramel hover:bg-cream transition-colors"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(product)}
                            className="p-1.5 rounded-lg text-mocha hover:text-red-600 hover:bg-red-50 transition-colors"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        key={editingProduct ? editingProduct.id : "new-product"}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        categories={categories}
        initialProduct={editingProduct}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!productToDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? It will be removed from both the admin table and the public customer menu.`}
        confirmLabel="Delete item"
        cancelLabel="Keep item"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
}
