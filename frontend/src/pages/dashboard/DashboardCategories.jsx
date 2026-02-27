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
import { Plus, Edit, Trash2, Layers } from "lucide-react";
import api from "../../lib/api";
import { toast } from "sonner";

const DashboardCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
        toast.success("Category updated successfully");
      } else {
        await api.post("/categories", formData);
        toast.success("Category created successfully");
      }
      setDialogOpen(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save category");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      image_url: category.image_url || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category? Products in this category will be uncategorized.",
      )
    )
      return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", image_url: "" });
  };

  return (
    <div className="p-8" data-testid="dashboard-categories-page">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-4xl font-semibold text-[#2C2C2C]">
          Categories
        </h1>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="bg-[#2C2C2C] text-white hover:bg-[#C5A059] transition-colors"
              data-testid="add-category-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 mt-2">
              {/* Name */}
              <div>
                <Label
                  htmlFor="cat-name"
                  className="text-sm font-medium text-gray-700"
                >
                  Name *
                </Label>
                <Input
                  id="cat-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Silk Sarees"
                  required
                  className="mt-1"
                  data-testid="category-name-input"
                />
              </div>

              {/* Description */}
              <div>
                <Label
                  htmlFor="cat-description"
                  className="text-sm font-medium text-gray-700"
                >
                  Description
                </Label>
                <Textarea
                  id="cat-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of this category..."
                  rows={3}
                  className="mt-1"
                  data-testid="category-description-input"
                />
              </div>

              {/* Image URL */}
              <div>
                <Label
                  htmlFor="cat-image"
                  className="text-sm font-medium text-gray-700"
                >
                  Image URL
                </Label>
                <Input
                  id="cat-image"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                  data-testid="category-image-input"
                />
                {formData.image_url && (
                  <div className="mt-2 w-full aspect-[3/1] bg-[#F2F0EB] overflow-hidden rounded">
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

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#2C2C2C] text-white hover:bg-[#C5A059] transition-colors"
                  data-testid="save-category-button"
                >
                  {editingCategory ? "Update" : "Create"} Category
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-24 bg-white border border-[#F2F0EB] rounded-md">
          <Layers className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No categories yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            Create your first category to organize your products.
          </p>
          <Button
            className="mt-6 bg-[#2C2C2C] text-white hover:bg-[#C5A059]"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Category
          </Button>
        </div>
      ) : (
        <>
          {/* Category Cards Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {categories.map((category, index) => {
              const fallbacks = [
                "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400",
                "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400",
                "https://images.unsplash.com/photo-1617627143233-4af8cfca1be3?w=400",
                "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400",
              ];
              return (
                <div
                  key={category.id}
                  className="bg-white border border-[#F2F0EB] rounded-md overflow-hidden group"
                  data-testid="category-card"
                >
                  <div className="aspect-[3/2] bg-[#F2F0EB] overflow-hidden">
                    <img
                      src={
                        category.image_url ||
                        fallbacks[index % fallbacks.length]
                      }
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-base font-medium text-[#2C2C2C] mb-1">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                        {category.description}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs h-8"
                        onClick={() => handleEdit(category)}
                        data-testid="edit-category-button"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(category.id)}
                        data-testid="delete-category-button"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table View */}
          <div className="bg-white border border-[#F2F0EB] rounded-md overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F2F0EB]">
              <h2 className="font-heading text-lg font-medium text-[#2C2C2C]">
                All Categories
              </h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} data-testid="category-row">
                    <TableCell className="font-medium font-heading">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm max-w-xs truncate">
                      {category.description || "—"}
                    </TableCell>
                    <TableCell>
                      {category.image_url ? (
                        <div className="w-12 h-8 rounded bg-[#F2F0EB] overflow-hidden">
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No image</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                          data-testid="edit-category-row-button"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
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
