import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Warehouse, Save, Search, AlertTriangle, Package } from "lucide-react";
import api from "../../lib/api";
import { toast } from "sonner";
import { formatPrice } from "../../lib/utils";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({}); // { [product_id]: true }
  const [edits, setEdits] = useState({}); // { [product_id]: quantity_string }
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | low | out

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products?limit=500&include_inactive=true");
      setProducts(res.data);
      // Pre-fill edits with current quantities
      const initial = {};
      res.data.forEach((p) => {
        initial[p.id] = String(p.inventory?.quantity ?? 0);
      });
      setEdits(initial);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (product) => {
    const qty = parseInt(edits[product.id]);
    if (isNaN(qty) || qty < 0) {
      toast.error("Enter a valid quantity (0 or more)");
      return;
    }
    setSaving((s) => ({ ...s, [product.id]: true }));
    try {
      await api.put(`/products/${product.id}/inventory`, { quantity: qty });
      // Update local state optimistically
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, inventory: { ...p.inventory, quantity: qty } }
            : p,
        ),
      );
      toast.success(`Stock updated: ${product.title} → ${qty} units`);
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to update stock");
    } finally {
      setSaving((s) => ({ ...s, [product.id]: false }));
    }
  };

  const handleKeyDown = (e, product) => {
    if (e.key === "Enter") handleSave(product);
  };

  const hasChanged = (p) =>
    parseInt(edits[p.id]) !== (p.inventory?.quantity ?? 0);

  // Filter + search
  const filtered = products.filter((p) => {
    const qty = p.inventory?.quantity ?? 0;
    const matchSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all"
        ? true
        : filter === "low"
          ? qty > 0 && qty <= 5
          : filter === "out"
            ? qty === 0
            : true;
    return matchSearch && matchFilter;
  });

  const totalStock = products.reduce(
    (sum, p) => sum + (p.inventory?.quantity ?? 0),
    0,
  );
  const outOfStock = products.filter(
    (p) => (p.inventory?.quantity ?? 0) === 0,
  ).length;
  const lowStock = products.filter((p) => {
    const q = p.inventory?.quantity ?? 0;
    return q > 0 && q <= 5;
  }).length;

  return (
    <div className="p-8" data-testid="inventory-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-4xl font-semibold text-[#2C2C2C]">
            Inventory
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {totalStock} units in stock across {products.length} products
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            key: "all",
            label: "Total Products",
            val: products.length,
            border: "border-l-gray-300",
            text: "text-[#2C2C2C]",
          },
          {
            key: "low",
            label: "Low Stock (≤ 5)",
            val: lowStock,
            border: "border-l-amber-400",
            text: "text-amber-600",
          },
          {
            key: "out",
            label: "Out of Stock",
            val: outOfStock,
            border: "border-l-red-400",
            text: "text-red-600",
          },
        ].map(({ key, label, val, border, text }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`bg-white border border-[#F2F0EB] border-l-4 ${border} rounded-xl p-4 text-left transition-all hover:shadow-sm ${
              filter === key ? "ring-2 ring-[#C5A059]/30 shadow-sm" : ""
            }`}
          >
            <p className={`text-3xl font-bold ${text}`}>{val}</p>
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

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#F2F0EB] rounded-xl">
          <Warehouse className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">
            No products found{search ? ` for "${search}"` : ""}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#F2F0EB] rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F9F8F5] hover:bg-[#F9F8F5]">
                <TableHead className="pl-5 w-16">Photo</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-44">Stock Quantity</TableHead>
                <TableHead className="w-24 pr-5 text-right">Save</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const qty = p.inventory?.quantity ?? 0;
                const editQty = parseInt(edits[p.id] ?? "0");
                const changed = hasChanged(p);
                const isSaving = saving[p.id];

                const stockStatus =
                  qty === 0
                    ? { label: "Out of Stock", cls: "bg-red-100 text-red-700" }
                    : qty <= 5
                      ? {
                          label: "Low Stock",
                          cls: "bg-amber-100 text-amber-700",
                        }
                      : {
                          label: "In Stock",
                          cls: "bg-green-100 text-green-700",
                        };

                const cover = p.images?.[0]?.url;

                return (
                  <TableRow
                    key={p.id}
                    className={`hover:bg-[#F9F8F5]/60 transition-colors ${!p.active ? "opacity-55" : ""}`}
                  >
                    {/* Thumb */}
                    <TableCell className="pl-5">
                      <div className="w-12 h-12 bg-[#F2F0EB] rounded-lg overflow-hidden">
                        {cover ? (
                          <img
                            src={cover}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-300" />
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Product info */}
                    <TableCell>
                      <p className="font-medium text-[#2C2C2C]">{p.title}</p>
                      {!p.active && (
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                          Hidden
                        </p>
                      )}
                    </TableCell>

                    <TableCell className="font-mono text-sm text-gray-400">
                      {p.sku}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(p.base_price)}
                    </TableCell>

                    {/* Stock status badge */}
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {qty === 0 && (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                        )}
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stockStatus.cls}`}
                        >
                          {stockStatus.label}
                        </span>
                      </div>
                    </TableCell>

                    {/* Editable stock input */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={edits[p.id] ?? qty}
                          onChange={(e) =>
                            setEdits((prev) => ({
                              ...prev,
                              [p.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => handleKeyDown(e, p)}
                          className={`w-24 text-center font-mono transition-all ${
                            changed
                              ? "border-[#C5A059] ring-1 ring-[#C5A059]/30 bg-[#FDFAF5]"
                              : "bg-white"
                          }`}
                        />
                        <span className="text-xs text-gray-400">units</span>
                      </div>
                    </TableCell>

                    {/* Save button */}
                    <TableCell className="pr-5 text-right">
                      <Button
                        size="sm"
                        onClick={() => handleSave(p)}
                        disabled={!changed || isSaving}
                        className={`h-8 transition-all ${
                          changed
                            ? "bg-[#2C2C2C] text-white hover:bg-[#C5A059]"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {isSaving ? (
                          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between px-5 py-3 border-t border-[#F2F0EB] bg-[#F9F8F5]">
            <p className="text-xs text-gray-400">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-gray-400">
              Edit quantity and press{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-[10px] font-mono">
                Enter
              </kbd>{" "}
              or click <Save className="inline w-3 h-3 mx-0.5" /> to save
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
