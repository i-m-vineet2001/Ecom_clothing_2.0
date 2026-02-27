import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  X,
  Tag,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatPrice } from "../../lib/utils";
import api from "../../lib/api";
import { toast } from "sonner";

// ── Image Upload Panel ─────────────────────────────────────────────────────────
const ImageUploadPanel = ({ product, onClose }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await api.get(`/products/${product.id}/images`);
      setImages(res.data);
    } catch {
      toast.error("Failed to load images");
    }
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", file.name.replace(/\.[^/.]+$/, ""));
      formData.append("sort_order", images.length.toString());

      try {
        await api.post(`/products/${product.id}/images/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(`Uploaded: ${file.name}`);
      } catch (e) {
        toast.error(
          `Failed to upload ${file.name}: ${e.response?.data?.detail || "error"}`,
        );
      }
    }

    setUploading(false);
    fetchImages();
  };

  const handleDelete = async (imageId) => {
    try {
      await api.delete(`/products/${product.id}/images/${imageId}`);
      setImages((prev) => prev.filter((i) => i.id !== imageId));
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Managing images for: <strong>{product.title}</strong>
      </p>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-md p-8 text-center transition-colors ${
          dragOver
            ? "border-[#C5A059] bg-[#FDF8F0]"
            : "border-gray-200 hover:border-[#C5A059]"
        }`}
      >
        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500 mb-3">
          Drag & drop images here, or click to select
        </p>
        <label className="cursor-pointer">
          <span className="bg-[#2C2C2C] text-white text-xs tracking-widest uppercase px-5 py-2 font-bold hover:bg-[#C5A059] transition-colors inline-block">
            {uploading ? "Uploading..." : "Select Files"}
          </span>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </label>
        <p className="text-xs text-gray-400 mt-2">
          JPEG, PNG, WebP, GIF · Max 10MB each
        </p>
      </div>

      {/* Image Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="relative group aspect-square bg-[#F2F0EB] rounded overflow-hidden"
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <button
                  onClick={() => handleDelete(img.id)}
                  className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {idx === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-[#C5A059] text-white text-[0.6rem] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-[#F9F8F5] rounded-md">
          <ImageIcon className="w-10 h-10 text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No images yet</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
};

// ── Discount Panel ─────────────────────────────────────────────────────────────
const DiscountPanel = ({ product, onClose }) => {
  const [discounts, setDiscounts] = useState([]);
  const [form, setForm] = useState({
    type: "percentage",
    value: "",
    starts_at: "",
    ends_at: "",
    active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const res = await api.get(`/products/${product.id}/discounts`);
      setDiscounts(res.data);
    } catch {
      toast.error("Failed to load discounts");
    }
  };

  const handleSave = async () => {
    if (!form.value || isNaN(parseFloat(form.value))) {
      toast.error("Please enter a valid discount value");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        type: form.type,
        value: parseFloat(form.value),
        active: form.active,
        starts_at: form.starts_at || null,
        ends_at: form.ends_at || null,
      };
      await api.post(`/products/${product.id}/discounts`, payload);
      toast.success("Discount created!");
      setForm({
        type: "percentage",
        value: "",
        starts_at: "",
        ends_at: "",
        active: true,
      });
      fetchDiscounts();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to create discount");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (discount) => {
    try {
      await api.put(`/products/${product.id}/discounts/${discount.id}`, {
        active: !discount.active,
      });
      fetchDiscounts();
    } catch {
      toast.error("Failed to update discount");
    }
  };

  const handleDelete = async (discountId) => {
    try {
      await api.delete(`/products/${product.id}/discounts/${discountId}`);
      setDiscounts((prev) => prev.filter((d) => d.id !== discountId));
      toast.success("Discount removed");
    } catch {
      toast.error("Failed to delete discount");
    }
  };

  const activeDiscount = discounts.find((d) => d.active);

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">
        Setting discount for: <strong>{product.title}</strong> — Base price:{" "}
        {formatPrice(product.base_price)}
      </p>

      {/* Active discount preview */}
      {activeDiscount && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-800">
                Active Discount
              </p>
              <p className="text-xs text-green-600 mt-0.5">
                {activeDiscount.type === "percentage"
                  ? `${activeDiscount.value}% off → ${formatPrice(product.base_price * (1 - activeDiscount.value / 100))}`
                  : `₹${activeDiscount.value} off → ${formatPrice(Math.max(0, product.base_price - activeDiscount.value))}`}
              </p>
            </div>
            <Tag className="w-5 h-5 text-green-600" />
          </div>
        </div>
      )}

      {/* New discount form */}
      <div className="bg-[#F9F8F5] rounded-md p-4 space-y-4">
        <p className="text-sm font-semibold text-[#2C2C2C]">Add New Discount</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Type</Label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-md bg-white"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          <div>
            <Label className="text-xs">
              Value {form.type === "percentage" ? "(%)" : "(₹)"}
            </Label>
            <Input
              type="number"
              min="0"
              max={form.type === "percentage" ? "100" : undefined}
              step="0.01"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              placeholder={form.type === "percentage" ? "e.g. 15" : "e.g. 500"}
              className="mt-1 text-sm"
            />
          </div>
        </div>

        {/* Preview */}
        {form.value && !isNaN(parseFloat(form.value)) && (
          <div className="text-xs text-gray-600 bg-white border border-gray-100 rounded px-3 py-2">
            Preview: {formatPrice(product.base_price)} →{" "}
            <strong className="text-[#C5A059]">
              {form.type === "percentage"
                ? formatPrice(
                    product.base_price * (1 - parseFloat(form.value) / 100),
                  )
                : formatPrice(
                    Math.max(0, product.base_price - parseFloat(form.value)),
                  )}
            </strong>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Start Date (optional)</Label>
            <Input
              type="datetime-local"
              value={form.starts_at}
              onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
              className="mt-1 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">End Date (optional)</Label>
            <Input
              type="datetime-local"
              value={form.ends_at}
              onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
              className="mt-1 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="discount-active"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
            className="accent-[#C5A059]"
          />
          <Label htmlFor="discount-active" className="text-sm cursor-pointer">
            Activate immediately
          </Label>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#2C2C2C] text-white hover:bg-[#C5A059] transition-colors"
        >
          <Tag className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Discount"}
        </Button>
      </div>

      {/* Existing discounts list */}
      {discounts.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            All Discounts
          </p>
          <div className="space-y-2">
            {discounts.map((d) => (
              <div
                key={d.id}
                className={`flex items-center justify-between p-3 rounded-md border text-sm ${
                  d.active
                    ? "border-green-200 bg-green-50"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <div>
                  <span className="font-medium">
                    {d.type === "percentage" ? `${d.value}%` : `₹${d.value}`}{" "}
                    off
                  </span>
                  <span
                    className={`ml-2 text-xs ${d.active ? "text-green-600" : "text-gray-400"}`}
                  >
                    {d.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(d)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {d.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
};

// ── Main Products Page ─────────────────────────────────────────────────────────
const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageDialogProduct, setImageDialogProduct] = useState(null);
  const [discountDialogProduct, setDiscountDialogProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    base_price: "",
    sku: "",
    category_id: "",
    active: true,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products?limit=1000");
      setProducts(response.data);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch {
      console.error("Failed to fetch categories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        base_price: parseFloat(formData.base_price),
      };
      if (!payload.category_id) delete payload.category_id;

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      setDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      base_price: product.base_price.toString(),
      sku: product.sku,
      category_id: product.category_id || "",
      active: product.active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      description: "",
      base_price: "",
      sku: "",
      category_id: "",
      active: true,
    });
  };

  return (
    <div className="p-8" data-testid="products-page">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-4xl font-semibold text-[#2C2C2C]">
          Products
        </h1>

        <Dialog
          open={dialogOpen}
          onOpenChange={(o) => {
            setDialogOpen(o);
            if (!o) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="bg-[#2C2C2C] text-white hover:bg-[#C5A059]"
              data-testid="add-product-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  data-testid="product-title-input"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  rows={3}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  data-testid="product-description-input"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="base_price">Base Price (₹) *</Label>
                  <Input
                    id="base_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.base_price}
                    onChange={(e) =>
                      setFormData({ ...formData, base_price: e.target.value })
                    }
                    required
                    data-testid="product-price-input"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    required
                    data-testid="product-sku-input"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category_id">Category</Label>
                <select
                  id="category_id"
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md text-sm"
                  data-testid="product-category-select"
                >
                  <option value="">No Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                  className="accent-[#C5A059]"
                  data-testid="product-active-checkbox"
                />
                <Label htmlFor="active" className="cursor-pointer">
                  Active (visible on store)
                </Label>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#2C2C2C] text-white hover:bg-[#C5A059]"
                  data-testid="save-product-button"
                >
                  {editingProduct ? "Update" : "Create"} Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Image Upload Dialog */}
      <Dialog
        open={!!imageDialogProduct}
        onOpenChange={(o) => {
          if (!o) {
            setImageDialogProduct(null);
            fetchProducts();
          }
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#C5A059]" /> Manage Images
            </DialogTitle>
          </DialogHeader>
          {imageDialogProduct && (
            <ImageUploadPanel
              product={imageDialogProduct}
              onClose={() => {
                setImageDialogProduct(null);
                fetchProducts();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Discount Dialog */}
      <Dialog
        open={!!discountDialogProduct}
        onOpenChange={(o) => {
          if (!o) {
            setDiscountDialogProduct(null);
            fetchProducts();
          }
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#C5A059]" /> Manage Discount
            </DialogTitle>
          </DialogHeader>
          {discountDialogProduct && (
            <DiscountPanel
              product={discountDialogProduct}
              onClose={() => {
                setDiscountDialogProduct(null);
                fetchProducts();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Product Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#F2F0EB] rounded-md">
          <p className="text-gray-500">
            No products yet. Create your first product!
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#F2F0EB] rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const mainImage = product.images?.[0]?.url;
                const hasDiscount = product.discount?.active;
                return (
                  <TableRow key={product.id} data-testid="product-row">
                    {/* Thumbnail */}
                    <TableCell>
                      <div className="w-12 h-12 bg-[#F2F0EB] rounded overflow-hidden">
                        {mainImage ? (
                          <img
                            src={mainImage}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-gray-300" />
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="font-medium">
                      {product.title}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {product.sku}
                    </TableCell>
                    <TableCell>{formatPrice(product.base_price)}</TableCell>

                    {/* Discount */}
                    <TableCell>
                      {hasDiscount ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-[#C5A059]/10 text-[#C5A059] px-2 py-0.5 rounded font-semibold">
                          <Tag className="w-3 h-3" />
                          {product.discount.type === "percentage"
                            ? `${product.discount.value}%`
                            : `₹${product.discount.value}`}{" "}
                          off
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </TableCell>

                    <TableCell>{product.inventory?.quantity ?? 0}</TableCell>

                    <TableCell>
                      {product.active ? (
                        <span className="text-green-600 text-sm font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-500 text-sm font-medium">
                          Inactive
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-1 justify-end">
                        {/* Images */}
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Manage Images"
                          onClick={() => setImageDialogProduct(product)}
                          data-testid="images-button"
                        >
                          <ImageIcon className="w-4 h-4 text-blue-500" />
                        </Button>
                        {/* Discount */}
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Set Discount"
                          onClick={() => setDiscountDialogProduct(product)}
                          data-testid="discount-button"
                        >
                          <Tag className="w-4 h-4 text-[#C5A059]" />
                        </Button>
                        {/* Edit */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          data-testid="edit-product-button"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          data-testid="delete-product-button"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Products;
