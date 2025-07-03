"use client";

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 dark:text-blue-300 mb-6 text-center">İade & Teslimat Politikası</h1>
        <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">İade Koşulları</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
          <li>Ürünü teslim aldıktan sonra 14 gün içinde iade talebinde bulunabilirsiniz.</li>
          <li>İade edilecek ürün kullanılmamış, orijinal kutusunda ve tüm aksesuarlarıyla birlikte olmalıdır.</li>
          <li>İade işlemi için <b>info@smshoes.com</b> adresine e-posta gönderebilirsiniz.</li>
          <li>İade kargo ücreti, ürün kusurlu değilse müşteriye aittir.</li>
        </ul>
        <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Teslimat Bilgileri</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
          <li>Siparişleriniz 1-2 iş günü içinde kargoya verilir.</li>
          <li>1000 TL ve üzeri alışverişlerde kargo ücretsizdir.</li>
          <li>Kargo firması teslimat süresi bölgeye göre değişiklik gösterebilir (genellikle 1-3 iş günü).</li>
        </ul>
        <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Destek</h2>
        <p className="text-gray-700 dark:text-gray-300">Her türlü soru ve destek için <a href="/contact" className="text-blue-600 hover:underline">İletişim</a> sayfamızdan bize ulaşabilirsiniz.</p>
      </div>
    </div>
  );
} 