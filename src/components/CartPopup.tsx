"use client";
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import Image from "next/image";

// Gerekli ikonlar
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const MinusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
);

interface Address {
  id: number;
  title: string;
  recipientName: string;
  // ... diğer adres alanları
}

export default function CartPopup() {
  const { isCartOpen, toggleCart, cartItems, addToCart, removeFromCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);

  const FREE_SHIPPING_THRESHOLD = 1000;
  const total = getCartTotal();
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - total;

  useEffect(() => {
    if (user) {
      const fetchAddresses = async () => {
        try {
          const res = await fetch("/api/addresses", {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setAddresses(data);
          }
        } catch {
          // Adresler alınamadı
        }
      };
      fetchAddresses();
    }
  }, [user]);

  const handleCheckout = () => {
    if (!user) {
      toast.error("Sipariş vermek için giriş yapmalısınız.");
      toggleCart();
      router.push("/login");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Sepetiniz boş.");
      return;
    }
    if (addresses.length === 0) {
      toast.error("Sipariş vermek için kayıtlı bir adresiniz olmalı.");
      toggleCart();
      router.push('/addresses');
      return;
    }
    // Sepet ve adres seçimiyle /checkout sayfasına yönlendir
    toggleCart();
    router.push("/checkout");
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Arka plan overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleCart}
      />
      {/* Sepet paneli */}
      <div
        className={`fixed top-0 left-0 w-full h-full z-50 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform overflow-x-hidden
        ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
        md:right-0 md:left-auto md:w-[400px] md:max-w-md md:translate-x-0 md:${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold">Sepetim</h2>
                <button onClick={toggleCart} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <XIcon className="w-6 h-6" />
                </button>
            </header>
            
            {/* Kargo Barı */}
            {cartItems.length > 0 && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                    {remainingForFreeShipping > 0 ? (
                        <p>
                            <span className="font-bold">₺{remainingForFreeShipping.toFixed(2)}</span> daha harcayın ve ücretsiz gönderi kazanın!
                        </p>
                    ) : (
                        <p className="font-bold text-green-600">Ücretsiz gönderiye hak kazandınız!</p>
                    )}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}></div>
                    </div>
                </div>
            )}
            
            {/* Ürün Listesi */}
            <main className="flex-1 overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                    <div className="text-center mt-20">
                        <p className="text-gray-500 mb-4">Sepetinizde ürün bulunmamaktadır.</p>
                        <button onClick={toggleCart} className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                            Alışverişe Devam Et
                        </button>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {cartItems.map((item, index) => (
                            <li key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex gap-4">
                                <Image
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded"
                                  width={48}
                                  height={48}
                                  unoptimized
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    {item.brand && (
                                        <p className="text-blue-600 text-sm font-medium">{item.brand}</p>
                                    )}
                                    <p className="text-gray-500 text-sm">₺{(Number(item.price) || 0).toFixed(2)}</p>
                                    {(item.size || item.color) && (
                                        <div className="text-xs text-gray-600 mt-1">
                                            {item.size && <span className="mr-2">Boyut: {item.size}</span>}
                                            {item.color && <span>Renk: {item.color}</span>}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 mt-2">
                                        <button 
                                            onClick={() => removeFromCart(item.id, item.color, item.size)} 
                                            className="p-1 border rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <MinusIcon className="w-4 h-4" />
                                        </button>
                                        <span>{Number(item.quantity) || 0}</span>
                                        <button 
                                            onClick={() => addToCart(item, 1, item.color, item.size)} 
                                            className="p-1 border rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="font-semibold">₺{((Number(item.price) || 0) * (Number(item.quantity) || 0)).toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
            
            {/* Footer */}
            {cartItems.length > 0 && (
                <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Toplam</span>
                        <span className="text-xl font-bold">₺{(Number(total) || 0).toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={handleCheckout} 
                        disabled={cartItems.length === 0}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Siparişi Tamamla
                    </button>
                </footer>
            )}
        </div>
      </div>
    </>
  );
} 