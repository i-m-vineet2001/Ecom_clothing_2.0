
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
} from "../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Plus, Edit, Trash2, Layers } from "lucide-react";
import api from "../../lib/api";
import ImageUploader from "../../components/ImageUploader";
import { toast } from "sonner";

const DashboardCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null = add mode
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // ── ROOT CAUSE FIX ────────────────────────────────────────────────────────
  // The original code used <DialogTrigger> wrapping "Add Category" while also
  // calling setFormData + setDialogOpen(true) in handleEdit. Because React 18
  // batches state updates, the dialog opened BEFORE formData was updated,
  // always showing the last-set values (e.g. "Cotton Sarees").
  //
  // Fix: Never use DialogTrigger. Control the dialog purely via open/onOpenChange.
  // Use this useEffect so formData always syncs AFTER editingCategory is set.
  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        description: editingCategory.description || "",
        image_url: editingCategory.image_url || "",
      });
    } else {
      setFormData({ name: "", description: "", image_url: "" });
    }
  }, [editingCategory]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null); // triggers useEffect → clears form
    setDialogOpen(true);
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat); // triggers useEffect → fills form with this category's data
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
        toast.success("Category updated!");
      } else {
        await api.post("/categories", formData);
        toast.success("Category created!");
      }
      handleClose();
      fetchCategories();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Delete this category? Products will be uncategorized.")
    )
      return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const fallbacks = [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400",
    "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400",
    "https://images.unsplash.com/photo-1617627143233-4af8cfca1be3?w=400",
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400",
  ];

  return (
    <div className="p-8" data-testid="dashboard-categories-page">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-4xl font-semibold text-[#2C2C2C]">
          Categories
        </h1>
        <Button
          onClick={handleAdd}
          className="bg-[#2C2C2C] text-white hover:bg-[#C5A059] transition-colors"
          data-testid="add-category-button"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      {/* ── Dialog — manually controlled, NO DialogTrigger ──────────────── */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(o) => {
          if (!o) handleClose();
        }}
      >
        <DialogContent className="max-w-lg !bg-white border border-[#E8E5E0] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              {editingCategory
                ? `Editing: ${editingCategory.name}`
                : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            <div>
              <Label htmlFor="cat-name">
                Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="cat-name"
                required
                autoComplete="off"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Silk Sarees"
                className="mt-1 focus:border-[#C5A059]"
                data-testid="category-name-input"
              />
            </div>
            <div>
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of this category…"
                className="mt-1 focus:border-[#C5A059]"
                data-testid="category-description-input"
              />
            </div>
            <div>
              <Label className="block mb-1.5">Image</Label>
              {editingCategory ? (
                // Category exists — can upload directly
                <ImageUploader
                  uploadUrl={`/categories/${editingCategory.id}/image/upload`}
                  multiple={false}
                  currentImages={
                    formData.image_url
                      ? [{ url: formData.image_url, id: null }]
                      : []
                  }
                  onChanged={async () => {
                    // Refresh the category to get new image_url
                    try {
                      const res = await api.get(
                        `/categories/${editingCategory.id}`,
                      );
                      setFormData((prev) => ({
                        ...prev,
                        image_url: res.data.image_url,
                      }));
                      fetchCategories();
                    } catch {}
                  }}
                />
              ) : (
                // New category — show URL field, image upload available after save
                <div className="space-y-2">
                  <Input
                    id="cat-img"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg (or save first to upload a file)"
                    className="focus:border-[#C5A059]"
                    data-testid="category-image-input"
                  />
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#C5A059] inline-block" />
                    Save the category first, then re-open Edit to upload an
                    image file
                  </p>
                  {formData.image_url && (
                    <div className="w-full aspect-[3/1] bg-[#F2F0EB] overflow-hidden rounded-lg">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-[#F2F0EB]">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#2C2C2C] text-white hover:bg-[#C5A059] transition-colors"
                data-testid="save-category-button"
              >
                {saving
                  ? "Saving…"
                  : editingCategory
                    ? "Update Category"
                    : "Create Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-24 bg-white border border-[#F2F0EB] rounded-xl">
          <Layers className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-1">No categories yet.</p>
          <p className="text-sm text-gray-400 mb-5">
            Create your first category to organize products.
          </p>
          <Button
            className="bg-[#2C2C2C] text-white hover:bg-[#C5A059]"
            onClick={handleAdd}
          >
            <Plus className="w-4 h-4 mr-2" /> Add First Category
          </Button>
        </div>
      ) : (
        <>
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="bg-white border border-[#F2F0EB] rounded-xl overflow-hidden group hover:shadow-md transition-all"
                data-testid="category-card"
              >
                <div className="aspect-[3/2] bg-[#F2F0EB] overflow-hidden">
                  <img
                    src={cat.image_url || fallbacks[idx % fallbacks.length]}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = fallbacks[idx % fallbacks.length];
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-base font-medium text-[#2C2C2C] mb-1">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                      {cat.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs h-8"
                      onClick={() => handleEdit(cat)}
                      data-testid="edit-category-button"
                    >
                      <Edit className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-red-500 hover:bg-red-50"
                      onClick={() => handleDelete(cat.id)}
                      data-testid="delete-category-button"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white border border-[#F2F0EB] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F2F0EB]">
              <h2 className="font-heading text-lg font-medium text-[#2C2C2C]">
                All Categories
              </h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F9F8F5]">
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-right pr-5">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow
                    key={cat.id}
                    className="hover:bg-[#F9F8F5]/50"
                    data-testid="category-row"
                  >
                    <TableCell className="font-medium font-heading">
                      {cat.name}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm max-w-xs truncate">
                      {cat.description || "—"}
                    </TableCell>
                    <TableCell>
                      {cat.image_url ? (
                        <div className="w-12 h-8 rounded bg-[#F2F0EB] overflow-hidden">
                          <img
                            src={cat.image_url}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No image</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-end pr-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                          onClick={() => handleEdit(cat)}
                          data-testid="edit-category-row-button"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-50"
                          onClick={() => handleDelete(cat.id)}
                          data-testid="delete-category-row-button"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardCategories;