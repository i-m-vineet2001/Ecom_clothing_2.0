import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "../components/ProductCard";
import api from "../lib/api";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get("/products?limit=8");
      setFeaturedProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[90vh]"
        data-testid="hero-section"
      >
        {/* Left - Text */}
        <div className="flex flex-col justify-center px-6 md:px-12 lg:px-24 py-20">
          <h1
            className="font-heading text-5xl md:text-7xl font-semibold tracking-tight text-[#2C2C2C] mb-6"
            data-testid="hero-title"
          >
            Crafting Elegance in Every Thread
          </h1>
          <p
            className="font-body text-base md:text-lg leading-relaxed text-gray-600 mb-8"
            data-testid="hero-subtitle"
          >
            Discover premium quality fabrics that blend tradition with
            contemporary design
          </p>
          <Link to="/catalog">
            <Button
              className="bg-[#2C2C2C] text-white hover:bg-[#C5A059] hover:text-white transition-all duration-300 px-8 py-3 rounded-none uppercase text-xs tracking-widest font-bold inline-flex items-center gap-2"
              data-testid="explore-collections-button"
            >
              Explore Collections
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Right - Image */}
        <div className="relative h-full min-h-[500px] md:min-h-0">
          <img
            src="https://images.unsplash.com/photo-1756483509177-bbabd67a3234?w=1200"
            alt="Elegant fashion"
            className="w-full h-full object-cover"
            data-testid="hero-image"
          />
        </div>
      </section>

      {/* Featured Products */}
      <section
        className="px-6 md:px-12 lg:px-24 py-20 md:py-32"
        data-testid="featured-products-section"
      >
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase text-gray-500 mb-4">
            Discover
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-medium tracking-tight text-[#2C2C2C]">
            Featured Products
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-20" data-testid="loading-state">
            <div className="inline-block w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-20" data-testid="empty-state">
            <p className="text-gray-500">No products available yet.</p>
            <Link to="/login">
              <Button className="mt-4">
                Login as Shopowner to Add Products
              </Button>
            </Link>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
            data-testid="products-grid"
          >
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {featuredProducts.length > 0 && (
          <div className="text-center mt-16">
            <Link to="/catalog">
              <Button
                variant="outline"
                className="border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-white transition-all duration-300 px-8 py-3 rounded-none uppercase text-xs tracking-widest font-bold"
                data-testid="view-all-button"
              >
                View All Products
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
