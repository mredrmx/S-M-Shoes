"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  featured?: boolean;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Fırsat ürünü için geri sayım sayacı state'leri
  const [hours, setHours] = useState(4);
  const [minutes, setMinutes] = useState(19);
  const [seconds, setSeconds] = useState(43);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev > 0) return prev - 1;
        setMinutes((m) => {
          if (m > 0) return m - 1;
          setHours((h) => {
            if (h > 0) return h - 1;
            return 23;
          });
          return 59;
        });
        return 59;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) {
          throw new Error("Ürünler yüklenirken bir hata oluştu");
        }
        const data = await res.json();
        setProducts(data.products || []);
      } catch {
        setError("Ürünler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleWishlist = async (productId: number) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-blue-950/40 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">S&M Shoes yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-blue-950/40 flex items-center justify-center px-4">
        <div className="text-center p-6 bg-white dark:bg-gray-950 rounded-2xl shadow-xl max-w-sm border border-gray-100 dark:border-gray-800">
          <p className="text-red-600 dark:text-red-400 mb-4 font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-md shadow-blue-500/20"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  const featuredProducts = products.filter(p => p.featured).slice(0, 6);
  const regularProducts = products.filter(p => !p.featured).slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/50 dark:from-gray-950 dark:via-gray-950 dark:to-blue-950/30">
      <div className="container mx-auto py-8 md:py-12 px-4 max-w-7xl">
        
        {/* Header Hero Area */}
        <header className="mb-12 md:mb-16 text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tight uppercase">
            S&M SHOES
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed px-4">
            Türkiye'nin her yerine ekspres teslimat güvencesiyle, en yeni ve en kaliteli ayakkabı koleksiyonu adımlarınıza şıklık katmak için burada!
          </p>
        </header>

        {/* Öne Çıkan Ürünler (İndirimli Gösterim) */}
        {featuredProducts.length > 0 && (
          <section className="mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-2">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                  🔥 Haftanın Popüler Modelleri
                </h2>
                <p className="text-xs md:text-sm text-gray-400 mt-1">Sınırlı süreli indirimli fiyatlarla öne çıkan koleksiyonlar</p>
              </div>
              <span className="h-0.5 flex-1 bg-gradient-to-r from-blue-600/10 to-transparent mx-4 hidden sm:block" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredProducts.map((product) => {
                const originalPrice = (product.price * 1.25).toFixed(0);
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 p-5 flex flex-col border border-gray-100 dark:border-gray-800/80 relative cursor-pointer"
                  >
                    {/* İstek Listesi Butonu */}
                    <button
                      type="button"
                      onClick={e => { e.preventDefault(); e.stopPropagation(); handleWishlist(product.id); }}
                      className="absolute top-4 left-4 z-20 p-2.5 rounded-full bg-white/90 dark:bg-gray-950/90 hover:bg-pink-50 dark:hover:bg-pink-950/40 text-gray-400 hover:text-pink-500 transition-colors shadow-md group/wishlist"
                      aria-label="İstek Listesine Ekle"
                    >
                      {isInWishlist(product.id) ? (
                        <HeartSolid className="w-5 h-5 text-pink-500 transition-colors" />
                      ) : (
                        <HeartOutline className="w-5 h-5 text-gray-400 group-hover/wishlist:text-pink-500 transition-colors" />
                      )}
                    </button>

                    {/* İndirim Rozeti */}
                    <div className="absolute top-4 right-4 bg-rose-500 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest shadow-md z-10 uppercase animate-pulse">
                      %20 İndirim
                    </div>

                    {/* Resim Alanı - Büyütüldü ve Modernleştirildi */}
                    <div className="w-full aspect-square relative overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-5 border border-gray-100/50 dark:border-gray-800/50">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
                          unoptimized
                        />
                      ) : (
                        <span className="text-gray-400 text-4xl">📦</span>
                      )}
                    </div>

                    {/* Detaylar */}
                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1.5 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Fiyat ve Stok */}
                    <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/80">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-400 dark:text-gray-500 line-through font-semibold">
                          ₺{Number(originalPrice).toLocaleString('tr-TR')}
                        </span>
                        <span className="text-lg font-black text-rose-500 dark:text-rose-400">
                          ₺{product.price.toLocaleString('tr-TR')}
                        </span>
                      </div>
                      
                      {/* Stok Durum Rozeti */}
                      <div>
                        {product.stock === 0 ? (
                          <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/20 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-900/30">Tükenmiş</span>
                        ) : product.stock < 5 ? (
                          <span className="text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-full border border-amber-100 dark:border-amber-900/30">Son Ürünler</span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">Stokta Var</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Fırsat Ürünü Bölümü (Countdown Banner) */}
        {products.length > 0 && (
          <section className="mb-16 bg-gradient-to-r from-blue-600 via-indigo-700 to-blue-700 dark:from-blue-950/60 dark:via-indigo-950/60 dark:to-blue-900/40 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden text-white flex flex-col lg:flex-row items-center gap-8 border border-blue-500/20">
            {/* Arkaplan Işık Efektleri */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex-1 space-y-5 text-center lg:text-left">
              <span className="inline-block bg-yellow-400 text-blue-950 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                🚨 GÜNÜN DEV FIRSATI
              </span>
              <h3 className="text-3xl md:text-4.5xl font-black tracking-tight leading-tight">
                {products[0].name}
              </h3>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-xl">
                Özel konforlu taban yapısı ve ultra nefes alabilir dış yüzeyiyle bu dönemin en gözde modeline şimdi lansmana özel sınırlı teklif fırsatıyla sahip olun!
              </p>
              
              {/* Sayaç */}
              <div className="flex justify-center lg:justify-start gap-4 pt-2">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center min-w-[75px] border border-white/10">
                  <div className="text-3xl font-black">{hours.toString().padStart(2, '0')}</div>
                  <div className="text-[9px] text-blue-200 font-bold uppercase tracking-wider">Saat</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center min-w-[75px] border border-white/10">
                  <div className="text-3xl font-black">{minutes.toString().padStart(2, '0')}</div>
                  <div className="text-[9px] text-blue-200 font-bold uppercase tracking-wider">Dakika</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center min-w-[75px] border border-white/10">
                  <div className="text-3xl font-black">{seconds.toString().padStart(2, '0')}</div>
                  <div className="text-[9px] text-blue-200 font-bold uppercase tracking-wider">Saniye</div>
                </div>
              </div>
            </div>
            
            {/* Görsel Kart ve Fiyat */}
            <div className="flex flex-col items-center gap-5 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 w-full lg:w-auto min-w-[300px]">
              <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-white/15 flex items-center justify-center p-2">
                <Image
                  src={products[0].imageUrl}
                  alt={products[0].name}
                  fill
                  className="object-cover rounded-xl"
                  unoptimized
                />
              </div>
              
              <div className="text-center w-full">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl font-black text-yellow-300">₺{products[0].price.toLocaleString('tr-TR')}</span>
                  <span className="text-sm text-blue-200 line-through">₺{(products[0].price * 1.35).toFixed(0)}</span>
                </div>
                
                {/* Stok Çubuğu */}
                <div className="w-full mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
                  <div className="bg-yellow-300 h-full rounded-full animate-pulse" style={{ width: '30%' }} />
                </div>
                <div className="text-[10px] text-blue-100 mt-1.5 font-medium">Sınırlı Stok: Son 2 Çift Kaldı!</div>
              </div>
              
              <Link
                href={`/products/${products[0].id}`}
                className="w-full text-center bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black py-3.5 px-6 rounded-xl transition-all hover:scale-[1.03] shadow-lg text-sm tracking-wider"
              >
                FIRSATI KAÇIRMA
              </Link>
            </div>
          </section>
        )}

        {/* Diğer Ürünler */}
        {regularProducts.length > 0 && (
          <section className="mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-2">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                  👟 Diğer Koleksiyonlar
                </h2>
                <p className="text-xs md:text-sm text-gray-400 mt-1">Modayı ve konforu bir arada sunan ayakkabılarımız</p>
              </div>
              <span className="h-0.5 flex-1 bg-gradient-to-r from-blue-600/10 to-transparent mx-4 hidden sm:block" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {regularProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 p-5 flex flex-col border border-gray-100 dark:border-gray-800/80 relative cursor-pointer"
                >
                  {/* İstek Listesi Butonu */}
                  <button
                    type="button"
                    onClick={e => { e.preventDefault(); e.stopPropagation(); handleWishlist(product.id); }}
                    className="absolute top-4 left-4 z-20 p-2.5 rounded-full bg-white/90 dark:bg-gray-950/90 hover:bg-pink-50 dark:hover:bg-pink-950/40 text-gray-400 hover:text-pink-500 transition-colors shadow-md group/wishlist"
                    aria-label="İstek Listesine Ekle"
                  >
                    {isInWishlist(product.id) ? (
                      <HeartSolid className="w-5 h-5 text-pink-500 transition-colors" />
                    ) : (
                      <HeartOutline className="w-5 h-5 text-gray-400 group-hover/wishlist:text-pink-500 transition-colors" />
                    )}
                  </button>

                  {/* Resim Alanı - Büyütüldü */}
                  <div className="w-full aspect-square relative overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-5 border border-gray-100/50 dark:border-gray-800/50">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
                        unoptimized
                      />
                    ) : (
                      <span className="text-gray-400 text-4xl">📦</span>
                    )}
                  </div>

                  {/* Detaylar */}
                  <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1.5 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Fiyat ve Stok */}
                  <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/80">
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                      ₺{product.price.toLocaleString('tr-TR')}
                    </span>
                    
                    {/* Stok Durum Rozeti */}
                    <div>
                      {product.stock === 0 ? (
                        <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/20 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-900/30">Tükenmiş</span>
                      ) : product.stock < 5 ? (
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-full border border-amber-100 dark:border-amber-900/30">Son Ürünler</span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">Stokta Var</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Tüm Ürünler Butonu */}
            <div className="flex justify-center mt-10">
              <Link
                href="/products"
                className="inline-block px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 text-sm tracking-wider"
              >
                TÜM KOLEKSİYONU İNCELE
              </Link>
            </div>
          </section>
        )}

        {products.length === 0 && (
          <div className="text-center py-16 px-4 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
              Henüz mağazada ürün bulunmuyor.
            </p>
            <Link 
              href="/admin/products" 
              className="inline-block px-6 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
            >
              İlk Ürünü Ekle
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
