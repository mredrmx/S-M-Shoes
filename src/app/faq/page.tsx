"use client";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 dark:text-blue-300 mb-6 text-center">Sıkça Sorulan Sorular</h1>
        <div className="space-y-6">
          <div>
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Siparişim ne zaman kargoya verilir?</h2>
            <p className="text-gray-700 dark:text-gray-300">Siparişleriniz genellikle 1-2 iş günü içinde kargoya verilir. Yoğun dönemlerde bu süre uzayabilir.</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Ürünler orijinal mi?</h2>
            <p className="text-gray-700 dark:text-gray-300">Tüm ürünlerimiz %100 orijinaldir ve üretici/ithalatçı garantilidir.</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">İade ve değişim nasıl yapılır?</h2>
            <p className="text-gray-700 dark:text-gray-300">Siparişinizi teslim aldıktan sonra 14 gün içinde iade veya değişim talebinde bulunabilirsiniz. Detaylar için <a href="/policy" className="text-blue-600 hover:underline">İade & Teslimat</a> sayfamızı inceleyin.</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Kapıda ödeme var mı?</h2>
            <p className="text-gray-700 dark:text-gray-300">Evet, kapıda ödeme seçeneğimiz mevcuttur.</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Kargo ücreti ne kadar?</h2>
            <p className="text-gray-700 dark:text-gray-300">1000 TL ve üzeri alışverişlerde kargo ücretsizdir. Altındaki siparişlerde sabit kargo ücreti uygulanır.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 