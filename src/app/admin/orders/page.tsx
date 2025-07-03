"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type OrderItem = {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    name: string;
    category?: string;
  };
};

type Order = {
  id: number;
  userId: number;
  status: string;
  createdAt: string;
  user: {
    name: string;
    surname: string;
    email: string;
    address?: string;
  };
  items: OrderItem[];
  address?: {
    title: string;
    fullAddress: string;
    city: string;
    district: string;
  };
  returnRequests?: { reason: string }[];
};

function Modal({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md flex flex-col gap-4 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl">×</button>
        {children}
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("Tümü");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const statusOptions = [
    "Tümü",
    "Beklemede",
    "Onaylandı",
    "Gönderildi",
    "İptal Edildi",
    "İptal Talebi"
  ];

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error("Siparişler yüklenirken bir hata oluştu.");
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(typeof err === "string" ? err : (err && (err as Error).message ? (err as Error).message : "Siparişler yüklenirken bir hata oluştu."));
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    let filtered = orders;
    if (statusFilter !== "Tümü") {
      filtered = filtered.filter(order => {
        if (statusFilter === "İptal Talebi") return order.returnRequests && order.returnRequests.length > 0;
        return order.status === statusFilter;
      });
    }
    setFilteredOrders(filtered);
  }, [orders, statusFilter]);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error("Durum güncellenirken bir hata oluştu.");
      }

      setSuccess("Sipariş durumu güncellendi.");
      setTimeout(() => setSuccess(""), 3000);
      fetchOrders();
    } catch (err) {
      setError(typeof err === "string" ? err : (err && (err as Error).message ? (err as Error).message : "Siparişler yüklenirken bir hata oluştu."));
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleApproveCancel = async (orderId: number) => {
    try {
      const res = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "İptal Edildi" }),
      });
      if (!res.ok) throw new Error("İptal işlemi başarısız oldu.");
      setSuccess("Sipariş iptal edildi.");
      setTimeout(() => setSuccess(""), 3000);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      setError(typeof err === "string" ? err : (err && (err as Error).message ? (err as Error).message : "Siparişler yüklenirken bir hata oluştu."));
      setTimeout(() => setError(""), 3000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Onaylandı": return "bg-green-100 text-green-800";
      case "Gönderildi": return "bg-blue-100 text-blue-800";
      case "İptal Edildi": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300">Sipariş Yönetimi</h1>
          <Link href="/admin" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            Admin Paneline Dön
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {statusOptions.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg border-2 transition-colors text-sm font-medium
                ${statusFilter === status
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400 bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-gray-200'}
              `}
            >
              {status}
            </button>
          ))}
        </div>

        {error && <div className="w-full py-2 px-4 rounded-lg bg-red-100 text-red-700 text-center mb-4">{error}</div>}
        {success && <div className="w-full py-2 px-4 rounded-lg bg-green-100 text-green-700 text-center mb-4">{success}</div>}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sipariş No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Müşteri</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ürünler</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Toplam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div>{order.user.name} {order.user.surname}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{order.user.email}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xs truncate" title={order.user.address}>{order.user.address}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      <ul>
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.product.name} x {item.quantity} ({item.price} ₺)
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {order.items.reduce((total, item) => total + item.price * item.quantity, 0)} ₺
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      {order.returnRequests && order.returnRequests.length > 0 && (
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">İptal Talebi</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        onClick={e => e.stopPropagation()}
                        className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="Beklemede">Beklemede</option>
                        <option value="Onaylandı">Onaylandı</option>
                        <option value="Gönderildi">Gönderildi</option>
                        <option value="İptal Edildi">İptal Edildi</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Modal open={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
          {selectedOrder && (
            <div>
              <h2 className="text-xl font-bold mb-2">Sipariş #{selectedOrder.id}</h2>
              <div className="mb-2"><span className="font-semibold">Kullanıcı:</span> {selectedOrder.user?.name} {selectedOrder.user?.surname} ({selectedOrder.user?.email})</div>
              <div className="mb-2"><span className="font-semibold">Adres:</span> {selectedOrder.address ? `${selectedOrder.address.title}, ${selectedOrder.address.fullAddress}, ${selectedOrder.address.city}/${selectedOrder.address.district}` : "-"}</div>
              <div className="mb-2"><span className="font-semibold">Ürünler:</span> {selectedOrder.items.map(i => `${i.product.name} (${i.quantity} x ${i.price}₺)`).join(", ")}</div>
              <div className="mb-2"><span className="font-semibold">Toplam:</span> {selectedOrder.items.reduce((t, i) => t + i.price * i.quantity, 0).toFixed(2)} ₺</div>
              <div className="mb-2"><span className="font-semibold">Durum:</span> {selectedOrder.status}</div>
              {selectedOrder.returnRequests && selectedOrder.returnRequests.length > 0 && (
                <div className="mb-2">
                  <span className="font-semibold text-red-600">İptal Talebi:</span> {selectedOrder.returnRequests.map(r => r.reason).join(", ")}
                  <button
                    className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    onClick={() => handleApproveCancel(selectedOrder.id)}
                  >
                    İptali Onayla
                  </button>
                </div>
              )}
              <div className="mb-2"><span className="font-semibold">Tarih:</span> {new Date(selectedOrder.createdAt).toLocaleString('tr-TR')}</div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
} 