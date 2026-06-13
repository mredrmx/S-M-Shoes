"use client";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 dark:text-blue-300 mb-6 text-center">İletişim</h1>
        <div className="mb-8">
          <p className="mb-2 text-gray-700 dark:text-gray-300"><b>Telefon:</b> <a href="tel:+905551112233" className="hover:text-blue-600">+90 555 111 22 33</a></p>
          <p className="mb-2 text-gray-700 dark:text-gray-300"><b>E-posta:</b> <a href="mailto:info@smshoes.com" className="hover:text-blue-600">info@smshoes.com</a></p>
          <p className="mb-2 text-gray-700 dark:text-gray-300"><b>Adres:</b> Karabük, Türkiye</p>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Adınız</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Adınızı girin" />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">E-posta</label>
            <input type="email" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="E-posta adresiniz" />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Mesajınız</label>
            <textarea className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" rows={4} placeholder="Mesajınızı yazın" />
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">Gönder</button>
        </form>
        <div className="mt-10 text-center text-gray-400 text-xs">
          (Burada harita veya yol tarifi için bir alan eklenebilir)
        </div>
      </div>
    </div>
  );
} 