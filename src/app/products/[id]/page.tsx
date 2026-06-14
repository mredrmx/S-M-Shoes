"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { toast } from "sonner";


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
  
  const [hasOrdered, setHasOrdered] = useState(false);
  const [commentError, setCommentError] = useState("");

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

  // Kullanıcının bu ürünü satın alıp almadığını kontrol et
  useEffect(() => {
    if (!user || !product) return;
    const checkPurchaseStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const orders = data.orders || [];
          const orderedThis = orders.some((order: any) =>
            order.items.some((item: any) => item.productId === product.id)
          );
          setHasOrdered(orderedThis);
        }
      } catch (err) {
        console.error("Sipariş geçmişi kontrol edilemedi:", err);
      }
    };
    checkPurchaseStatus();
  }, [user, product]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize) {
      toast.warning("Lütfen bir beden seçin.");
      return;
    }
    
    if (colors.length > 0 && !selectedColor) {
      toast.warning("Lütfen bir renk seçin.");
      return;
    }

    addToCart(product, 1, selectedColor, selectedSize);
    toast.success(`${product.name} sepete eklendi!`);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError("");

    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (!newComment || newRating === 0) {
      setCommentError("Yorum metni yazmalı ve puanlama (yıldız) seçmelisiniz.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: product?.id, rating: newRating, text: newComment }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Yorum eklenirken hata oluştu.");
      }
      
      setNewComment("");
      setNewRating(0);
      
      // Yorumları tekrar yükle
      const commRes = await fetch(`/api/comments?productId=${product?.id}`);
      const commData = await commRes.json();
      setComments(commData.comments || []);
    } catch (err: any) {
      setCommentError(err.message || "Yorum eklenirken bir hata oluştu.");
    }
  };

  const colors = product ? JSON.parse(product.colors || "[]") : [];
  const sizes = product ? JSON.parse(product.sizes || "[]") : [];
  const images = product ? JSON.parse(product.images || "[]") : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-950 dark:to-blue-950/20 p-4 md:p-8">
        <div className="w-full max-w-6xl mx-auto animate-page-fade">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-6 animate-pulse" />

          {/* Details Split Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 bg-white/60 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-3xl mb-12">
            {/* Left - Image Gallery Skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
              <div className="grid grid-cols-5 gap-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>

            {/* Right - Product Info Skeleton */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
                </div>
                <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                </div>
                <div className="h-14 w-full bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-750 rounded-2xl animate-pulse" />
                
                {/* Size Selection Skeleton */}
                <div className="space-y-2 pt-2">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="flex gap-2.5">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-12 w-12 bg-gray-250 dark:bg-gray-850 rounded-xl animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-14 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-blue-950/40 flex items-center justify-center">
        <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
          <p className="text-red-500 font-bold mb-4">Ürün bulunamadı</p>
          <button onClick={() => router.push("/products")} className="px-6 py-2 bg-blue-600 text-white rounded-xl">Ürünlere Dön</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-950 dark:to-blue-950/20 p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
            <li>
              <button 
                onClick={() => router.push("/products")}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Ürünler
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white font-semibold truncate max-w-[200px] md:max-w-xs">{product.name}</li>
          </ol>
        </nav>

        {/* Product Info Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 bg-white/60 dark:bg-gray-900/40 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/80 shadow-xl shadow-gray-100/50 dark:shadow-none mb-12">
          
          {/* Sol - Görseller */}
          <div className="space-y-4">
            {/* Ana Büyük Görsel */}
            <div className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden relative border border-gray-100 dark:border-gray-800 shadow-md">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            
            {/* Küçük Görsel Galerisi */}
            {images.length > 0 && (
              <div className="grid grid-cols-5 gap-3">
                <button 
                  onClick={() => setSelectedImage(product.imageUrl)}
                  className={`aspect-square rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 border-2 transition-all relative ${
                    selectedImage === product.imageUrl 
                      ? "border-blue-600 scale-95 shadow-sm" 
                      : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
                {images.map((image: string, index: number) => (
                  <button 
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 border-2 transition-all relative ${
                      selectedImage === image 
                        ? "border-blue-600 scale-95 shadow-sm" 
                        : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sağ - Detaylar ve Seçenekler */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Marka & Kategori */}
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 rounded-full border border-blue-100/50 dark:border-blue-900/30">
                  {product.brand}
                </span>
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/80 rounded-full">
                  {product.category}
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3.5xl font-black text-gray-900 dark:text-white leading-tight mb-4">{product.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">{product.description}</p>
              
              {/* Fiyat ve Stok */}
              <div className="flex items-center gap-4 py-4 px-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 mb-6">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  ₺{product.price.toLocaleString('tr-TR')}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                
                {/* Stok Durum Göstergesi (Net sayı kaldırıldı) */}
                <div>
                  {product.stock === 0 ? (
                    <span className="text-xs font-bold text-red-500 bg-red-100/50 dark:bg-red-950/20 px-3 py-1 rounded-full border border-red-100 dark:border-red-900/30">Tükenmiş</span>
                  ) : product.stock < 5 ? (
                    <span className="text-xs font-bold text-amber-500 bg-amber-100/50 dark:bg-amber-950/20 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-900/30">Son Ürünler (Tükenmek Üzere!)</span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-950/20 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">Stokta Var</span>
                  )}
                </div>
              </div>

              {/* Beden Seçimi */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">Numara / Beden Seçimi</label>
                <div className="flex flex-wrap gap-2.5">
                  {sizes.map((size: string | number) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(String(size))}
                      className={`min-w-[48px] h-[48px] px-3 rounded-xl border-2 transition-all text-sm font-bold flex items-center justify-center
                        ${selectedSize === String(size)
                          ? 'border-blue-600 bg-blue-500 text-white shadow-md shadow-blue-500/10'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-800 dark:text-gray-200'}
                      `}
                    >
                      {String(size)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Renk Seçimi */}
              {colors.length > 0 && (
                <div className="mb-8">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2.5">Renk Seçimi</label>
                  <div className="flex flex-wrap gap-2.5">
                    {colors.map((color: string) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-5 py-2.5 rounded-xl border-2 transition-all text-xs font-bold uppercase tracking-wider
                          ${selectedColor === color
                            ? "border-blue-600 bg-blue-500 text-white shadow-md shadow-blue-500/10"
                            : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-800 dark:text-gray-200"
                          }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sepete Ekle Butonu */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                product.stock === 0
                  ? "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-300 dark:border-gray-700"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/15 hover:shadow-xl hover:shadow-blue-600/25 active:scale-[0.99]"
              }`}
            >
              {product.stock === 0 ? "STOKTA YOK" : "SEPETE EKLE"}
            </button>
          </div>
        </div>

        {/* Yorumlar ve Puanlama */}
        <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-8 border border-gray-200/50 dark:border-gray-800/80">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-6">Müşteri Değerlendirmeleri</h2>
          
          {/* Yorum Yazma Formu */}
          <div className="mb-10 pb-10 border-b border-gray-100 dark:border-gray-800">
            {user ? (
              hasOrdered ? (
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Bu Ürünü Değerlendir:</h3>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="focus:outline-none hover:scale-110 transition-transform"
                      >
                        <svg
                          className={`w-8 h-8 ${newRating >= star ? "text-yellow-400" : "text-gray-300 dark:text-gray-700"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    rows={3}
                    placeholder="Yorumunuzu ve deneyimlerinizi buraya yazın..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                  />
                  {commentError && <div className="text-xs text-red-500 font-bold">{commentError}</div>}
                  <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/10">Gönder</button>
                </form>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 text-xs font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>Yorum yazmak için önce bu ürünü satın almış olmanız gerekmektedir.</span>
                </div>
              )
            ) : (
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 text-xs font-semibold flex items-center gap-2">
                <span>🔒</span>
                <span>Değerlendirme yazabilmek için lütfen giriş yapın.</span>
              </div>
            )}
          </div>

          {/* Yorumlar Listesi */}
          <div className="space-y-6">
            {commentsLoading ? (
              <p className="text-gray-400 text-sm">Yorumlar yükleniyor...</p>
            ) : comments.length === 0 ? (
              <p className="text-gray-400 text-sm italic">Bu ürüne henüz yorum yapılmamış.</p>
            ) : (
              comments.map(c => (
                <div key={c.id} className="border-b border-gray-100 dark:border-gray-850 pb-5 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">{c.user ? `${c.user.name} ${c.user.surname}` : "Anonim Müşteri"}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${c.rating >= star ? "text-yellow-400" : "text-gray-200 dark:text-gray-700"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{c.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}