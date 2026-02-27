import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { Layers } from "lucide-react";

// Elegant placeholder images for categories (fallback if no image set)
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800",
  "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800",
  "https://images.unsplash.com/photo-1617627143233-4af8cfca1be3?w=800",
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" data-testid="categories-page">
      {/* Page Header */}
      <div className="px-6 md:px-12 lg:px-24 pt-20 pb-16 text-center">
        <p className="text-xs tracking-widest uppercase text-gray-500 mb-4">
          Browse
        </p>
        <h1 className="font-heading text-4xl md:text-6xl font-semibold tracking-tight text-[#2C2C2C]">
          All Categories
        </h1>
        <p className="mt-6 text-gray-500 text-base max-w-md mx-auto font-body leading-relaxed">
          Explore our curated collections of premium textiles and fabrics
        </p>
      </div>

      {/* Categories Grid */}
      <div className="px-6 md:px-12 lg:px-24 pb-24">
        {loading ? (
          <div className="text-center py-20" data-testid="loading-state">
            <div className="inline-block w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : categories.length === 0 ? (
          <div
            className="text-center py-24 bg-white border border-[#F2F0EB]"
            data-testid="empty-state"
          >
            <Layers className="w-14 h-14 text-gray-200 mx-auto mb-5" />
            <p className="text-gray-500 text-lg font-body">
              No categories available yet.
            </p>
            <p className="text-sm text-gray-400 mt-2 font-body">
              Categories will appear here once added by the shop owner.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            data-testid="categories-grid"
          >
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/catalog?category_id=${category.id}`}
                className="group relative overflow-hidden bg-[#F2F0EB] block no-underline"
                data-testid="category-card"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={
                      category.image_url ||
                      FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
                    }
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                </div>

                {/* Label */}
                <div className="p-5 bg-white border-t border-[#F2F0EB]">
                  <h2 className="font-heading text-xl font-medium text-[#2C2C2C] group-hover:text-[#C5A059] transition-colors duration-200">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="text-sm text-gray-500 mt-1.5 font-body leading-relaxed line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-body tracking-widest uppercase text-[#C5A059] font-bold">
                    Shop Now
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
