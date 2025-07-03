"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<{ id: number; user?: { name: string; surname: string }; rating: number; text: string }[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);

  const productId = params.id as string;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          setSelectedImage(data.product.imageUrl);
        } else {
          router.push("/products");
        }
      } catch {
        router.push("/products");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  useEffect(() => {
    if (!product) return;
    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const res = await fetch(`/api/comments?productId=${product?.id}`);
        const data = await res.json();
        setComments(data.comments || []);
      } catch {
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    };
    fetchComments();
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize) {
      alert("Lütfen bir boyut seçin");
      return;
    }
    
    if (!selectedColor) {
      alert("Lütfen bir renk seçin");
      return;
    }

    addToCart(product, 1, selectedColor, selectedSize);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (!newComment || newRating === 0) return;
    const token = localStorage.getItem("token");
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId: product?.id, rating: newRating, text: newComment }),
    });
    if (res.ok) {
      setNewComment("");
      setNewRating(0);
      // Yorumları tekrar çek
      const data = await fetch(`/api/comments?productId=${product?.id}`).then(r => r.json());
      setComments(data.comments || []);
    }
  };

  const colors = product ? JSON.parse(product.colors || "[]") : [];
  const sizes = product ? JSON.parse(product.sizes || "[]") : [];
  const images = product ? JSON.parse(product.images || "[]") : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center">
        <div className="text-2xl text-blue-600 dark:text-blue-400">Yükleniyor...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center">
        <div className="text-2xl text-red-600 dark:text-red-400">Ürün bulunamadı</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-4 md:mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <button 
                onClick={() => router.push("/products")}
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                Ürünler
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white truncate">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
          {/* Ürün Görselleri */}
          <div className="space-y-4">
            {/* Ana Görsel */}
            <div className="aspect-square bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <Image
                src={selectedImage}
                alt={product.name}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            
            {/* Küçük Görseller */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                <div 
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                    selectedImage === product.imageUrl 
                      ? "border-blue-600" 
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  onClick={() => setSelectedImage(product.imageUrl)}
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                {images.map((image: string, index: number) => (
                  <div 
                    key={index}
                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                      selectedImage === image 
                        ? "border-blue-600" 
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ürün Bilgileri ve Seçimler */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">₺{product.price}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Stok: {product.stock}</span>
            </div>
            {/* Boyut Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Beden</label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size: string|number) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(String(size))}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors text-sm font-medium
                      ${selectedSize === String(size)
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}
                    `}
                  >
                    {String(size)}
                  </button>
                ))}
              </div>
            </div>
            {/* Renk Seçimi */}
            {colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Renk Seçin
                </h3>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        selectedColor === color
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sepete Ekle Butonu */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${
                product.stock === 0
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {product.stock === 0 ? "Stokta Yok" : "Sepete Ekle"}
            </button>

            {/* Ürün Özellikleri */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ürün Özellikleri
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Marka:</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Kategori:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Mevcut Renkler:</span>
                  <span className="font-medium">{colors.join(", ") || "Belirtilmemiş"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Mevcut Boyutlar:</span>
                  <span className="font-medium">{sizes.join(", ") || "Belirtilmemiş"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Yorumlar ve Puanlama */}
        <div className="mt-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Yorumlar & Puanlama</h2>
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="flex items-center mb-2">
              {[1,2,3,4,5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="focus:outline-none"
                >
                  <svg
                    className={`w-7 h-7 ${newRating >= star ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                  </svg>
                </button>
              ))}
            </div>
            <textarea
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 mb-2"
              rows={3}
              placeholder="Yorumunuzu yazın..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">Gönder</button>
          </form>
          <div className="space-y-4">
            {commentsLoading ? (
              <p className="text-gray-500">Yorumlar yükleniyor...</p>
            ) : comments.length === 0 ? (
              <p className="text-gray-500">Henüz yorum yok.</p>
            ) : comments.map(c => (
              <div key={c.id} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <div className="flex items-center mb-1">
                  <span className="font-semibold text-gray-900 dark:text-white mr-2">{c.user?.name} {c.user?.surname}</span>
                  <div className="flex">
                    {[1,2,3,4,5].map(star => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${c.rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}