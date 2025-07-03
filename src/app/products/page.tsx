"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  brand: string;
  category: string;
  colors: string;
  sizes: string;
  images: string;
};

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tüm Ürünler");

  const fetchProducts = useCallback(async (category?: string) => {
    let url = "/api/products";
    if (category && category !== "Tüm Ürünler") {
      url += `?category=${encodeURIComponent(category)}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    setProducts(data.products || []);
    // Kategorileri localde tutmak için, sadece ilk yüklemede güncelle
    if (categories.length === 0) {
      const cats = Array.from(new Set((data.products || []).map((p: Product) => p.category))) as string[];
      setCategories(["Tüm Ürünler", ...cats]);
    }
  }, [categories.length]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    fetchProducts(cat);
  };

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-blue-700 dark:text-blue-300 text-center">Tüm Ürünler</h2>
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors cursor-pointer
                ${selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 hover:border-blue-400'}
              `}
              style={{ minWidth: 100 }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-transform transition-shadow duration-200 cursor-pointer hover:scale-105 hover:shadow-2xl p-4 flex flex-col items-center border border-gray-100 dark:border-gray-700"
            >
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover rounded-xl mb-4"
                  unoptimized
                />
              )}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">{product.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-2 text-center line-clamp-2">{product.description.replace(/'/g, "&apos;")}</p>
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-base font-bold text-blue-600 dark:text-blue-400">₺{product.price}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Stok: {product.stock}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 