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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950">
      <div className="container mx-auto py-6 md:py-8 lg:py-12 px-4">
        <header className="mb-6 md:mb-8 lg:mb-12 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-blue-700 dark:text-blue-300 tracking-tight uppercase">
            S&M SHOES
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-4 md:mb-6 lg:mb-8 px-4">
            Türkiye&apos;nin her yerine hızlı teslimat ile en yeni ve en kaliteli ayakkabılar burada!
          </p>
        </header>

        {/* Öne Çıkan Ürünler */}
        {featuredProducts.length > 0 && (
          <section className="mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-6 lg:mb-8 text-gray-800 dark:text-gray-200 px-4">
              Öne Çıkan Ürünler
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-transform transition-shadow duration-200 p-4 md:p-6 flex flex-col items-center border border-gray-100 dark:border-gray-700 relative cursor-pointer hover:scale-105 hover:shadow-2xl"
                >
                  {/* İstek Listesi Butonu */}
                  <button
                    type="button"
                    onClick={e => { e.preventDefault(); e.stopPropagation(); handleWishlist(product.id); }}
                    className="absolute top-2 left-2 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 hover:bg-pink-100 dark:hover:bg-pink-900 transition-colors shadow-md group"
                    aria-label="İstek Listesine Ekle"
                  >
                    {isInWishlist(product.id) ? (
                      <HeartSolid className="w-5 h-5 text-pink-500 transition-colors" />
                    ) : (
                      <HeartOutline className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
                    )}
                  </button>
                  <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Öne Çıkan
                  </div>
                  <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mb-3 md:mb-4 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                        unoptimized
                      />
                    ) : null}
                    <div className="text-gray-400 text-xl md:text-2xl lg:text-4xl hidden">📦</div>
                  </div>
                  <h3 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                    {product.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-300 mb-3 text-center line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between w-full mb-3 md:mb-4">
                    <span className="text-sm md:text-base lg:text-lg font-bold text-blue-600 dark:text-blue-400">
                      ₺{product.price}
                    </span>
                    <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      Stok: {product.stock}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Diğer Ürünler */}
        {regularProducts.length > 0 && (
          <section>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-6 lg:mb-8 text-gray-800 dark:text-gray-200 px-4">
              Diğer Ürünler
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {regularProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-transform transition-shadow duration-200 p-4 md:p-6 flex flex-col items-center border border-gray-100 dark:border-gray-700 relative cursor-pointer hover:scale-105 hover:shadow-2xl"
                >
                  {/* İstek Listesi Butonu */}
                  <button
                    type="button"
                    onClick={e => { e.preventDefault(); e.stopPropagation(); handleWishlist(product.id); }}
                    className="absolute top-2 left-2 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 hover:bg-pink-100 dark:hover:bg-pink-900 transition-colors shadow-md group"
                    aria-label="İstek Listesine Ekle"
                  >
                    {isInWishlist(product.id) ? (
                      <HeartSolid className="w-5 h-5 text-pink-500 transition-colors" />
                    ) : (
                      <HeartOutline className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
                    )}
                  </button>
                  <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mb-3 md:mb-4 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                        unoptimized
                      />
                    ) : null}
                    <div className="text-gray-400 text-xl md:text-2xl lg:text-4xl hidden">📦</div>
                  </div>
                  <h3 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                    {product.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-300 mb-3 text-center line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between w-full mb-3 md:mb-4">
                    <span className="text-sm md:text-base lg:text-lg font-bold text-blue-600 dark:text-blue-400">
                      ₺{product.price}
                    </span>
                    <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      Stok: {product.stock}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {/* Tüm Ürünler Butonu */}
            <div className="flex justify-center mt-8">
              <Link
                href="/products"
                className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-base md:text-lg shadow-md"
              >
                Tüm Ürünleri Görüntüle
              </Link>
            </div>
          </section>
        )}

        {products.length === 0 && (
          <div className="text-center py-8 md:py-12 px-4">
            <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg mb-4">
              Henüz ürün bulunmuyor.
            </p>
            <Link 
              href="/admin/products" 
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              İlk Ürünü Ekle
            </Link>
          </div>
        )}

        <footer className="mt-12 md:mt-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-8 px-4">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-700 dark:text-gray-300 text-sm">
            {/* Marka ve Açıklama */}
            <div>
              <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-2">S&M SHOES</h3>
              <p className="mb-3">Türkiye&apos;nin lider ayakkabı mağazası. Kalite, güven ve hızlı teslimat ile hizmetinizdeyiz.</p>
              <div className="flex space-x-3 mt-2">
                <a href="https://instagram.com/smshoes" target="_blank" rel="noopener" aria-label="Instagram" className="hover:text-blue-600"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.41.59.22 1.01.48 1.45.92.44.44.7.86.92 1.45.17.46.354 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.41 2.43-.22.59-.48 1.01-.92 1.45-.44.44-.86.7-1.45.92-.46.17-1.26.354-2.43.41-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.43-.41-.59-.22-1.01-.48-1.45-.92-.44-.44-.7-.86-.92-1.45-.17-.46-.354-1.26-.41-2.43C2.212 15.784 2.2 15.4 2.2 12s.012-3.584.07-4.85c.056-1.17.24-1.97.41-2.43.22-.59.48-1.01.92-1.45.44-.44.86-.7 1.45-.92.46-.17 1.26-.354 2.43-.41C8.416 2.212 8.8 2.2 12 2.2zm0-2.2C8.736 0 8.332.012 7.052.07 5.77.128 4.87.31 4.13.54c-.77.24-1.42.56-2.07 1.21-.65.65-.97 1.3-1.21 2.07-.23.74-.412 1.64-.47 2.92C.012 8.332 0 8.736 0 12c0 3.264.012 3.668.07 4.948.058 1.28.24 2.18.47 2.92.24.77.56 1.42 1.21 2.07.65.65 1.3.97 2.07 1.21.74.23 1.64.412 2.92.47C8.332 23.988 8.736 24 12 24c3.264 0 3.668-.012 4.948-.07 1.28-.058 2.18-.24 2.92-.47.77-.24 1.42-.56 2.07-1.21.65-.65.97-1.3 1.21-2.07.23-.74.412-1.64.47-2.92.058-1.28.07-1.684.07-4.948 0-3.264-.012-3.668-.07-4.948-.058-1.28-.24-2.18-.47-2.92-.24-.77-.56-1.42-1.21-2.07-.65-.65-1.3-.97-2.07-1.21-.74-.23-1.64-.412-2.92-.47C15.668.012 15.264 0 12 0z"/><path d="M12 5.838A6.162 6.162 0 1 0 12 18.162 6.162 6.162 0 1 0 12 5.838zm0 10.162A4 4 0 1 1 12 8a4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg></a>
                <a href="https://facebook.com/smshoes" target="_blank" rel="noopener" aria-label="Facebook" className="hover:text-blue-600"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg></a>
                <a href="https://twitter.com/smshoes" target="_blank" rel="noopener" aria-label="Twitter" className="hover:text-blue-600"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.116 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg></a>
              </div>
            </div>
            {/* Hızlı Linkler */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Hızlı Linkler</h4>
              <ul className="space-y-1">
                <li><Link href="/" className="hover:text-blue-600">Anasayfa</Link></li>
                <li><Link href="/products" className="hover:text-blue-600">Ürünler</Link></li>
                <li><Link href="/about" className="hover:text-blue-600">Hakkımızda</Link></li>
                <li><Link href="/contact" className="hover:text-blue-600">İletişim</Link></li>
                <li><Link href="/faq" className="hover:text-blue-600">S.S.S.</Link></li>
                <li><Link href="/policy" className="hover:text-blue-600">İade & Teslimat</Link></li>
              </ul>
            </div>
            {/* İletişim Bilgileri */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">İletişim</h4>
              <ul className="space-y-1">
                <li><span className="font-medium">Telefon:</span> <a href="tel:+905551112233" className="hover:text-blue-600">+90 555 111 22 33</a></li>
                <li><span className="font-medium">E-posta:</span> <a href="mailto:info@smshoes.com" className="hover:text-blue-600">info@smshoes.com</a></li>
                <li><span className="font-medium">Adres:</span> Karabük, Türkiye</li>
                <li><span className="font-medium">Çalışma Saatleri:</span> 09:00 - 18:00 (Pzt-Cum)</li>
              </ul>
            </div>
            {/* Ödeme Yöntemleri ve Güvenlik */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Ödeme Yöntemleri</h4>
              <div className="flex flex-col space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <svg width="20" height="20" fill="currentColor" className="text-green-600" viewBox="0 0 20 20"><path d="M2 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5zm2 0v10h12V5H4zm3 2h6v2H7V7zm0 4h4v2H7v-2z"/></svg>
                  <span>Kapıda Ödeme</span>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <svg width="20" height="20" fill="currentColor" className="text-green-500" viewBox="0 0 20 20"><path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm-1 15l-5-5 1.414-1.414L9 12.172l5.293-5.293 1.414 1.414L9 15z"/></svg>
                <span className="text-xs text-gray-500">256-bit SSL ile korunmaktadır</span>
              </div>
            </div>
          </div>
          <div className="container mx-auto mt-8 text-center text-gray-400 text-xs">
            © {new Date().getFullYear()} S&M SHOES | Tüm hakları saklıdır.
          </div>
        </footer>
      </div>

    </div>
  );
}
