"use client";
import React, { useEffect, useState } from "react";
import AccountLayout from "@/components/AccountLayout";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

type OrderItem = {
  id: number;
  product: { name: string; imageUrl: string };
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [refresh, setRefresh] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Siparişleri görmek için giriş yapmalısınız.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Siparişler yüklenemedi.");
        }
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Siparişler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    
    if(user) fetchOrders();
  }, [user, refresh]);

  const getStatusChip = (status: string) => {
    switch (status.toLowerCase()) {
      case "onaylandı":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "gönderildi":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "iptal edildi":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    }
  };

  const calculateOrderTotal = (items: OrderItem[]) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  }

  const handleCancel = async (orderId: number) => {
    const reason = prompt("Siparişi iptal etme sebebinizi yazınız:");
    if (!reason) return;
    const token = localStorage.getItem("token");
    const res = await fetch("/api/orders/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderId, reason }),
    });
    if (res.ok) {
      setInfo("Sipariş iptal talebiniz alınmıştır!");
      setRefresh(r => r + 1);
    } else {
      setInfo("Sipariş iptal talebi başarısız oldu.");
    }
    setTimeout(() => setInfo(""), 3000);
  };

  return (
    <AccountLayout>
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Siparişlerim</h1>
      
      {info && <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-center">{info}</div>}
      
      {loading && <p>Yükleniyor...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <p>Henüz hiç siparişiniz yok.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-semibold text-lg">Sipariş #{order.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tarih: {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="text-right">
                     <p className="font-bold text-xl text-blue-600 dark:text-blue-400">
                        {calculateOrderTotal(order.items)} ₺
                     </p>
                     <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusChip(order.status)}`}>
                        {order.status}
                     </span>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg"
                        unoptimized
                      />
                      <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.quantity} x {item.price.toFixed(2)} ₺
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.status.toLowerCase() !== "iptal edildi" && (
                    <div className="flex gap-4 mt-4">
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Siparişi İptal Et
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </AccountLayout>
  );
} 