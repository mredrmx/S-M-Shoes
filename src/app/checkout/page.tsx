"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Listbox } from '@headlessui/react';
import Image from "next/image";

interface Address {
  id: number;
  title: string;
  recipientName: string;
  recipientSurname: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string;
  fullAddress: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  imageUrl?: string;
}

// İkonlar
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Misafir siparişi için state'ler
  const [guestForm, setGuestForm] = useState({
    email: "",
    recipientName: "",
    recipientSurname: "",
    phone: "",
    city: "",
    district: "",
    neighborhood: "",
    fullAddress: ""
  });

  const fetchAddresses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("/api/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Adresler yüklenemedi.");
      const data = await res.json();
      setAddresses(data);
      if (data.length > 0) setSelectedAddressId(data[0].id);
    } catch {
      setError("Adresler yüklenemedi.");
    }
  };

  useEffect(() => {
    // Giriş yapma kontrolünü kaldırıp misafir siparişi seçeneğini ekliyoruz.
    if (user) {
      fetchAddresses();
    }
    // Sepeti localStorage'dan çek
    const cart = localStorage.getItem("cart");
    if (cart) setCartItems(JSON.parse(cart));
  }, [user]);

  // Sayfa görünürlüğü değiştiğinde (örn. /addresses'ten geri dönünce) adresleri tekrar çek
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && user) {
        fetchAddresses();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [user]);

  // Eğer query parametresinde refresh varsa adresleri tekrar çek
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('refresh') && user) {
      fetchAddresses();
    }
  }, [user]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  };

  const handleGuestInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setGuestForm({ ...guestForm, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    if (user && !selectedAddressId) {
      setError("Lütfen bir teslimat adresi seçin.");
      return;
    }

    if (!user) {
      // Misafir bilgileri doğrulaması
      const { email, recipientName, recipientSurname, phone, city, district, neighborhood, fullAddress } = guestForm;
      if (!email || !recipientName || !recipientSurname || !phone || !city || !district || !neighborhood || !fullAddress) {
        setError("Lütfen misafir sipariş formundaki tüm zorunlu alanları doldurun.");
        return;
      }
    }

    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    try {
      const payload: any = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size,
        }))
      };

      if (user) {
        payload.addressId = selectedAddressId;
      } else {
        payload.guestAddress = {
          ...guestForm,
          title: "Misafir Adresi"
        };
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Sipariş oluşturulamadı.");
      }

      setSuccess(true);
      localStorage.removeItem("cart");

      // Kullanıcı giriş yaptıysa siparişler sayfasına yönlendir, misafir ise anasayfaya yönlendir
      setTimeout(() => {
        if (user) {
          router.push("/orders");
        } else {
          alert("Siparişiniz başarıyla alındı! Alışverişiniz için teşekkür ederiz.");
          router.push("/");
        }
      }, 1500);

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sipariş oluşturulamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2.5xl md:text-3xl font-black mb-6 md:mb-8 text-gray-900 dark:text-white">Ödeme & Sipariş Tamamlama</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-900/30 text-sm font-semibold">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-300 rounded-xl border border-green-200 dark:border-green-900/30 text-sm font-semibold">
          Siparişiniz başarıyla oluşturuldu! Yönlendiriliyorsunuz...
        </div>
      )}
 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Sol Taraf - Adres ve İletişim Bilgileri */}
        <div className="space-y-6">
          {user ? (
            /* Kayıtlı Kullanıcı Adres Seçimi */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Teslimat Adresi</h2>
                <Link 
                  href="/addresses" 
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold"
                >
                  Adres Ekle
                </Link>
              </div>
              
              {addresses.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                  <HomeIcon className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Kayıtlı adresiniz bulunmamaktadır.</p>
                  <Link 
                    href="/addresses" 
                    className="inline-flex items-center px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition text-sm shadow-md"
                  >
                    Adres Ekle
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <Listbox value={selectedAddressId} onChange={setSelectedAddressId}>
                    <div className="relative">
                      <Listbox.Button className="w-full p-3.5 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-850 dark:text-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold shadow-sm cursor-pointer">
                        {addresses.find(a => a.id === selectedAddressId)?.title || "Adres seçiniz"}
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-30 mt-1.5 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-950 py-1.5 text-sm shadow-xl border border-gray-100 dark:border-gray-800 focus:outline-none">
                        {addresses.map(address => (
                          <Listbox.Option
                            key={address.id}
                            value={address.id}
                            className={({ active }) =>
                              `cursor-pointer select-none relative py-3 pl-10 pr-4 ${active ? 'bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-250'}`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-bold' : 'font-medium'}`}>{address.title}</span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-white">
                                    ✓
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                  
                  {selectedAddressId && (
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-250/30 dark:border-gray-800 text-sm leading-relaxed space-y-1 text-gray-700 dark:text-gray-300">
                      {(() => {
                        const address = addresses.find(a => a.id === selectedAddressId);
                        if (!address) return null;
                        return (
                          <>
                            <div className="font-bold text-gray-900 dark:text-white text-base mb-1">{address.title}</div>
                            <div><span className="font-semibold text-gray-500">Alıcı:</span> {address.recipientName} {address.recipientSurname}</div>
                            <div><span className="font-semibold text-gray-500">Adres:</span> {address.fullAddress}</div>
                            <div><span className="font-semibold text-gray-500">Bölge:</span> {address.neighborhood}, {address.district}, {address.city}</div>
                            <div><span className="font-semibold text-gray-500">Telefon:</span> {address.phone}</div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Misafir Sipariş Formu */
            <div className="space-y-4">
              <div className="flex flex-col mb-2">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Misafir Alışveriş Bilgileri</h2>
                <p className="text-xs text-gray-400">Üyeliğiniz yoksa bilgilerinizi girerek hızlıca sipariş verebilirsiniz.</p>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="recipientName"
                    placeholder="Ad *"
                    value={guestForm.recipientName}
                    onChange={handleGuestInputChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  />
                  <input
                    type="text"
                    name="recipientSurname"
                    placeholder="Soyad *"
                    value={guestForm.recipientSurname}
                    onChange={handleGuestInputChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="email"
                    name="email"
                    placeholder="E-posta Adresi *"
                    value={guestForm.email}
                    onChange={handleGuestInputChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Telefon Numarası *"
                    value={guestForm.phone}
                    onChange={handleGuestInputChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    name="city"
                    placeholder="Şehir *"
                    value={guestForm.city}
                    onChange={handleGuestInputChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  />
                  <input
                    type="text"
                    name="district"
                    placeholder="İlçe *"
                    value={guestForm.district}
                    onChange={handleGuestInputChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  />
                  <input
                    type="text"
                    name="neighborhood"
                    placeholder="Mahalle *"
                    value={guestForm.neighborhood}
                    onChange={handleGuestInputChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  />
                </div>

                <textarea
                  name="fullAddress"
                  placeholder="Açık Adres (Sokak, Bina No, Daire, vb.) *"
                  value={guestForm.fullAddress}
                  onChange={handleGuestInputChange}
                  rows={3}
                  className="w-full p-3 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sağ Taraf - Sepet Özeti */}
        <div className="space-y-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Sipariş Özeti</h2>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Sepetiniz boş.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-200/50 dark:border-gray-800/80">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Ürünler</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-850">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center gap-4">
                    {item.imageUrl && (
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white truncate text-sm">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.quantity} x ₺{Number(item.price).toLocaleString('tr-TR')}
                      </p>
                      {(item.size || item.color) && (
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-1 space-x-2">
                          {item.size && <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">Beden: {item.size}</span>}
                          {item.color && <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">Renk: {item.color}</span>}
                        </div>
                      )}
                    </div>
                    <div className="font-black text-gray-900 dark:text-white text-sm">
                      ₺{((Number(item.price) || 0) * (Number(item.quantity) || 0)).toLocaleString('tr-TR')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900/80 border-t border-gray-150 dark:border-gray-800">
                <div className="flex justify-between items-center text-base font-black text-gray-900 dark:text-white">
                  <span>Genel Toplam</span>
                  <span>₺{getCartTotal().toLocaleString('tr-TR')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Siparişi Tamamla Butonu */}
          <button
            onClick={handleOrder}
            disabled={loading || (user && !selectedAddressId) || cartItems.length === 0}
            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
          >
            {loading ? "Siparişiniz alınıyor..." : "Siparişi Tamamla"}
          </button>
        </div>
      </div>
    </div>
  );
}