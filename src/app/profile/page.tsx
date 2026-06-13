"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AccountLayout from "@/components/AccountLayout";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", surname: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (user) {
      setForm({ name: user.name || "", surname: user.surname || "", email: user.email || "" });
    }
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Oturum bulunamadı. Lütfen tekrar giriş yapın.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/profile/api", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, surname: form.surname }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Profil güncellenirken bir hata oluştu.");
      }
      setSuccess("Profil bilgileriniz başarıyla güncellendi.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Profil güncellenirken bir hata oluştu.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) return;
    setDeleteLoading(true);
    setDeleteError("");
    setDeleteSuccess("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/profile/api", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Hesap silinemedi.");
      setDeleteSuccess("Hesabınız silindi. Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => {
        localStorage.removeItem("token");
        router.push("/login");
      }, 2000);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Hesap silinemedi.");
    } finally {
      setDeleteLoading(false);
      setTimeout(() => setDeleteError(""), 3000);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AccountLayout>
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Kişisel Bilgiler</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            E-posta
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            disabled
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ad
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="surname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Soyad
            </label>
            <input
              id="surname"
              name="surname"
              type="text"
              value={form.surname}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        </div>

        {error && <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">{error}</div>}
        {success && <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm">{success}</div>}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-wait"
          >
            {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>
        </div>
      </form>

      <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8">
        <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Tehlikeli Alan</h2>
        <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-lg border border-red-200 dark:border-red-800/50">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Hesabı Sil</h3>
          <p className="text-red-600 dark:text-red-300 mt-2 mb-4 text-sm">
            Hesabınızı silme talebi gönderdiğinizde bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.
          </p>
          <button
            className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-sm"
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Siliniyor..." : "Hesabı Silme Talebi Gönder"}
          </button>
          {deleteError && <div className="mt-3 p-2 bg-red-100 text-red-700 rounded text-sm">{deleteError}</div>}
          {deleteSuccess && <div className="mt-3 p-2 bg-green-100 text-green-700 rounded text-sm">{deleteSuccess}</div>}
        </div>
      </div>
    </AccountLayout>
  );
} 