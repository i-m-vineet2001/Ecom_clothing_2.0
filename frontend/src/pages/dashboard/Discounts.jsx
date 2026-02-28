import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Tag,
  Plus,
  Trash2,
  Edit,
  ToggleLeft,
  ToggleRight,
  Search,
} from "lucide-react";
import api from "../../lib/api";
import { toast } from "sonner";
import { formatPrice } from "../../lib/utils";

// ── Discount form modal ────────────────────────────────────────────────────────
const DiscountFormDialog = ({
  open,
  onClose,
  product,
  editingDiscount,
  onSaved,
}) => {
  const [form, setForm] = useState({
    type: "percentage",
    value: "",
    starts_at: "",
    ends_at: "",
    active: true,
  });
  const [saving, setSaving] = useState(false);

  // Sync form when editingDiscount or open changes
  useEffect(() => {
    if (editingDiscount) {
      setForm({
        type: editingDiscount.type,
        value: String(editingDiscount.value),
        starts_at: editingDiscount.starts_at
          ? new Date(editingDiscount.starts_at).toISOString().slice(0, 16)
          : "",
        ends_at: editingDiscount.ends_at
          ? new Date(editingDiscount.ends_at).toISOString().slice(0, 16)
          : "",
        active: editingDiscount.active,
      });
    } else {
      setForm({
        type: "percentage",
        value: "",
        starts_at: "",
        ends_at: "",
        active: true,
      });
    }
  }, [editingDiscount, open]);

  const previewPrice = () => {
    const v = parseFloat(form.value);
    if (!v || isNaN(v) || v <= 0 || !product) return null;
    return form.type === "percentage"
      ? product.base_price * (1 - v / 100)
      : Math.max(0, product.base_price - v);
  };
  const preview = previewPrice();

  const handleSave = async (e) => {
    e.preventDefault();
    const v = parseFloat(form.value);
    if (!v || v <= 0) {
      toast.error("Enter a valid discount value");
      return;
    }
    if (form.type === "percentage" && v > 100) {
      toast.error("Percentage can't exceed 100%");
      return;
    }
    setSaving(true);
    const payload = {
      type: form.type,
      value: v,
      active: form.active,
      starts_at: form.starts_at || null,
      ends_at: form.ends_at || null,
    };
    try {
      if (editingDiscount) {
        await api.put(
          `/products/${product.id}/discounts/${editingDiscount.id}`,
          payload,
        );
        toast.success("Discount updated!");
      } else {
        await api.post(`/products/${product.id}/discounts`, payload);
        toast.success("Discount created!");
      }
      onSaved();
      onClose();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to save discount");
    } finally {
      setSaving(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#C5A059]" />
            {editingDiscount ? "Edit Discount" : "Add Discount"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between py-3 px-4 bg-[#F9F8F5] rounded-lg mb-2">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Product
            </p>
            <p className="font-heading font-semibold text-[#2C2C2C]">
              {product.title}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Base Price</p>
            <p className="font-bold text-lg">
              {formatPrice(product.base_price)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Type</Label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white focus:border-[#C5A059] outline-none"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">
                {form.type === "percentage" ? "%" : "₹"} Value *
              </Label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder={
                  form.type === "percentage" ? "e.g. 15" : "e.g. 500"
                }
                className="bg-white focus:border-[#C5A059]"
              />
            </div>
          </div>

          {/* Live preview */}
          {preview !== null && (
            <div className="flex items-center gap-3 bg-white border border-[#C5A059]/30 rounded-lg px-4 py-3">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Customer pays</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-[#C5A059]">
                    {formatPrice(preview)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.base_price)}
                  </span>
                </div>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-gray-400">Saving</p>
                <p className="text-sm font-bold text-green-600">
                  {form.type === "percentage"
                    ? `${parseFloat(form.value)}%`
                    : formatPrice(product.base_price - preview)}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">
                Start date (optional)
              </Label>
              <Input
                type="datetime-local"
                value={form.starts_at}
                onChange={(e) =>
                  setForm({ ...form, starts_at: e.target.value })
                }
                className="text-xs focus:border-[#C5A059]"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">
                End date (optional)
              </Label>
              <Input
                type="datetime-local"
                value={form.ends_at}
                onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
                className="text-xs focus:border-[#C5A059]"
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="accent-[#C5A059] w-4 h-4"
            />
            <span className="text-sm text-gray-700">Active immediately</span>
          </label>

          <div className="flex gap-3 pt-2 border-t border-[#F2F0EB]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#2C2C2C] text-white hover:bg-[#C5A059] transition-colors"
            >
              {saving ? "Saving…" : editingDiscount ? "Update" : "Create"}{" "}
              Discount
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN DISCOUNTS PAGE
// ══════════════════════════════════════════════════════════════════════════════
const Discounts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | none
  const [selectedProduct, setSelected] = useState(null);
  const [editingDiscount, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products?limit=500&include_inactive=true");
      setProducts(res.data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = (product) => {
    setSelected(product);
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (product, discount) => {
    setSelected(product);
    setEditing(discount);
    setFormOpen(true);
  };

  const handleToggle = async (product, discount) => {
    try {
      await api.put(`/products/${product.id}/discounts/${discount.id}`, {
        active: !discount.active,
      });
      toast.success(
        discount.active ? "Discount deactivated" : "Discount activated",
      );
      fetchAll();
    } catch {
      toast.error("Failed to toggle discount");
    }
  };

  const handleDelete = async (product, discount) => {
    if (!window.confirm(`Delete this discount for "${product.title}"?`)) return;
    try {
      await api.delete(`/products/${product.id}/discounts/${discount.id}`);
      toast.success("Discount deleted");
      fetchAll();
    } catch {
      toast.error("Failed to delete discount");
    }
  };

  // Filter
  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());
    const hasActive = p.discount?.active;
    const hasAny = !!p.discount;
    const matchFilter =
      filter === "all"
        ? true
        : filter === "active"
          ? hasActive
          : filter === "none"
            ? !hasAny
            : true;
    return matchSearch && matchFilter;
  });

  const totalActive = products.filter((p) => p.discount?.active).length;
  const totalWithDiscount = products.filter((p) => p.discount).length;

  return (
    <div className="p-8" data-testid="discounts-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-4xl font-semibold text-[#2C2C2C]">
            Discounts
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {totalActive} active · {totalWithDiscount} total discounts across{" "}
            {products.length} products
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            key: "all",
            label: "All Products",
            val: products.length,
            border: "border-l-gray-300",
          },
          {
            key: "active",
            label: "Active Discounts",
            val: totalActive,
            border: "border-l-[#C5A059]",
          },
          {
            key: "none",
            label: "No Discount Set",
            val: products.length - totalWithDiscount,
            border: "border-l-blue-300",
          },
        ].map(({ key, label, val, border }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`bg-white border border-[#F2F0EB] border-l-4 ${border} rounded-xl p-4 text-left transition-all hover:shadow-sm ${
              filter === key ? "ring-2 ring-[#C5A059]/30 shadow-sm" : ""
            }`}
          >
            <p className="text-3xl font-bold text-[#2C2C2C]">{val}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product name or SKU…"
          className="pl-9 bg-white border-[#E8E5E0] focus:border-[#C5A059]"
        />
      </div>

      {/* Discount Form */}
      <DiscountFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelected(null);
          setEditing(null);
        }}
        product={selectedProduct}
        editingDiscount={editingDiscount}
        onSaved={fetchAll}
      />

      {/* Product cards */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#F2F0EB] rounded-xl">
          <Tag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">
            No products found{search ? ` for "${search}"` : ""}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const disc = p.discount;
            const cover = p.images?.[0]?.url;
            const finalPrice = disc?.active
              ? disc.type === "percentage"
                ? p.base_price * (1 - disc.value / 100)
                : Math.max(0, p.base_price - disc.value)
              : null;

            return (
              <div
                key={p.id}
                className={`bg-white border rounded-xl overflow-hidden transition-all hover:shadow-md ${
                  disc?.active ? "border-[#C5A059]/40" : "border-[#F2F0EB]"
                }`}
              >
                <div className="flex gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 bg-[#F2F0EB] rounded-lg overflow-hidden shrink-0">
                    {cover ? (
                      <img
                        src={cover}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tag className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-heading font-semibold text-[#2C2C2C] truncate">
                          {p.title}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          {p.sku}
                        </p>
                      </div>
                      {/* Active badge */}
                      {disc && (
                        <span
                          className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            disc.active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {disc.active ? "Active" : "Off"}
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mt-2">
                      {finalPrice !== null ? (
                        <>
                          <span className="font-bold text-[#C5A059]">
                            {formatPrice(finalPrice)}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(p.base_price)}
                          </span>
                          <span className="text-xs text-green-600 font-semibold">
                            {disc.type === "percentage"
                              ? `${disc.value}% off`
                              : `₹${disc.value} off`}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-[#2C2C2C]">
                          {formatPrice(p.base_price)}
                        </span>
                      )}
                    </div>

                    {/* Date range */}
                    {disc?.starts_at || disc?.ends_at ? (
                      <p className="text-[10px] text-gray-400 mt-1">
                        {disc.starts_at &&
                          `From ${new Date(disc.starts_at).toLocaleDateString("en-IN")}`}
                        {disc.starts_at && disc.ends_at && " → "}
                        {disc.ends_at &&
                          new Date(disc.ends_at).toLocaleDateString("en-IN")}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 px-4 pb-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openAdd(p)}
                    className="flex-1 h-8 text-xs hover:border-[#C5A059] hover:text-[#C5A059]"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Discount
                  </Button>
                  {disc && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(p, disc)}
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        title="Edit discount"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggle(p, disc)}
                        className={`h-8 w-8 p-0 ${disc.active ? "hover:bg-red-50 text-red-400" : "hover:bg-green-50 text-green-600"}`}
                        title={disc.active ? "Deactivate" : "Activate"}
                      >
                        {disc.active ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(p, disc)}
                        className="h-8 w-8 p-0 hover:bg-red-50 text-gray-300 hover:text-red-500"
                        title="Delete discount"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Discounts;
