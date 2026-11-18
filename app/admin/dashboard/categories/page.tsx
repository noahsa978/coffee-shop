"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Tags,
  Coffee,
} from "lucide-react";
import {
  initialAdminCategories,
  initialAdminProducts,
  type Category,
  type Product,
} from "@/data/admin-mock";
import { CategoryFormModal } from "@/components/admin/CategoryFormModal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(
    initialAdminCategories.sort((a, b) => a.displayOrder - b.displayOrder)
  );
  const [products] = useState<Product[]>(initialAdminProducts);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Delete confirmation
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  // Compute product count per category
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Reorder: Move Up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newCategories = [...categories];
    const temp = newCategories[index - 1];
    newCategories[index - 1] = newCategories[index];
    newCategories[index] = temp;

    // Normalize display order numbers
    const reindexed = newCategories.map((cat, idx) => ({
      ...cat,
      displayOrder: idx + 1,
    }));
    setCategories(reindexed);
  };

  // Reorder: Move Down
  const handleMoveDown = (index: number) => {
    if (index === categories.length - 1) return;
    const newCategories = [...categories];
    const temp = newCategories[index + 1];
    newCategories[index + 1] = newCategories[index];
    newCategories[index] = temp;

    // Normalize display order numbers
    const reindexed = newCategories.map((cat, idx) => ({
      ...cat,
      displayOrder: idx + 1,
    }));
    setCategories(reindexed);
  };

  // Add / Edit Save
  const handleSaveCategory = (
    data: Omit<Category, "id"> & { id?: string }
  ) => {
    if (data.id) {
      // Edit
      setCategories((prev) =>
        prev
          .map((c) =>
            c.id === data.id
              ? { ...c, name: data.name, displayOrder: data.displayOrder }
              : c
          )
          .sort((a, b) => a.displayOrder - b.displayOrder)
      );
    } else {
      // Add
      const newCat: Category = {
        id: data.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        name: data.name,
        displayOrder: data.displayOrder,
      };
      setCategories((prev) =>
        [...prev, newCat].sort((a, b) => a.displayOrder - b.displayOrder)
      );
    }
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      setCategories((prev) =>
        prev
          .filter((c) => c.id !== categoryToDelete.id)
          .map((c, idx) => ({ ...c, displayOrder: idx + 1 }))
      );
      setCategoryToDelete(null);
    }
  };

  const deleteWarningMessage = useMemo(() => {
    if (!categoryToDelete) return "";
    const count = productCounts[categoryToDelete.id] || 0;
    if (count > 0) {
      return `Warning: This category currently has ${count} assigned ${
        count === 1 ? "product" : "products"
      }. Deleting it will remove the section header from the customer menu.`;
    }
    return `Are you sure you want to delete the "${categoryToDelete.name}" category? This action cannot be undone.`;
  }, [categoryToDelete, productCounts]);

  return (
    <div className="space-y-6 sm:space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-espresso font-normal tracking-tight">
            Menu Categories
          </h1>
          <p className="text-xs sm:text-sm text-mocha mt-1">
            Organize menu sections and adjust the horizontal tab order shown to customers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingCategory(null);
            setIsFormModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-caramel text-warm-white text-xs sm:text-sm font-medium hover:bg-caramel-dark active:scale-[0.99] transition-all cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add category</span>
        </button>
      </div>

      {/* Category List / Table */}
      <div className="bg-warm-white rounded-2xl border border-caramel/20 shadow-xs overflow-hidden">
        {categories.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-cream border border-caramel/25 flex items-center justify-center text-caramel mx-auto mb-3">
              <Tags className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg text-espresso">No categories defined</h3>
            <p className="text-xs text-mocha mt-1 max-w-sm mx-auto">
              Create your first category to start organizing items on the customer menu.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-espresso border-collapse">
              <thead>
                <tr className="border-b border-caramel/15 bg-cream/50 text-[11px] uppercase tracking-wider text-mocha font-semibold">
                  <th scope="col" className="py-3 px-4 sm:px-6 w-24">
                    Order
                  </th>
                  <th scope="col" className="py-3 px-4 sm:px-6">
                    Category Name
                  </th>
                  <th scope="col" className="py-3 px-4 text-center">
                    Items Count
                  </th>
                  <th scope="col" className="py-3 px-4 text-center">
                    Reorder
                  </th>
                  <th scope="col" className="py-3 px-4 sm:px-6 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-caramel/10">
                {categories.map((cat, idx) => {
                  const itemCount = productCounts[cat.id] || 0;
                  const isFirst = idx === 0;
                  const isLast = idx === categories.length - 1;

                  return (
                    <tr
                      key={cat.id}
                      className="hover:bg-cream/40 transition-colors"
                    >
                      {/* Display Order Badge */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="w-7 h-7 rounded-lg bg-cream border border-caramel/20 flex items-center justify-center text-xs font-semibold text-espresso">
                          {cat.displayOrder}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-espresso text-sm sm:text-base">
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-mocha/60 font-mono">
                            ({cat.id})
                          </span>
                        </div>
                      </td>

                      {/* Product Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cream/80 border border-caramel/20 text-mocha">
                          <Coffee className="w-3.5 h-3.5 text-caramel" />
                          <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                        </span>
                      </td>

                      {/* Reorder Up/Down */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1 bg-cream/60 p-1 rounded-xl border border-caramel/20">
                          <button
                            type="button"
                            onClick={() => handleMoveUp(idx)}
                            disabled={isFirst}
                            className="p-1 rounded-lg text-mocha hover:text-espresso hover:bg-cream disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                            aria-label={`Move ${cat.name} up in order`}
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDown(idx)}
                            disabled={isLast}
                            className="p-1 rounded-lg text-mocha hover:text-espresso hover:bg-cream disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                            aria-label={`Move ${cat.name} down in order`}
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategory(cat);
                              setIsFormModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-mocha hover:text-caramel hover:bg-cream transition-colors cursor-pointer"
                            aria-label={`Edit ${cat.name}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setCategoryToDelete(cat)}
                            className="p-1.5 rounded-lg text-mocha hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            aria-label={`Delete ${cat.name}`}
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

      {/* Add / Edit Category Modal */}
      <CategoryFormModal
        key={editingCategory ? editingCategory.id : "new-category"}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        initialCategory={editingCategory}
        suggestedDisplayOrder={categories.length + 1}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!categoryToDelete}
        title="Delete Category"
        message={deleteWarningMessage}
        confirmLabel="Delete Category"
        cancelLabel="Keep Category"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  );
}
