"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 dark:text-blue-300 mb-6 text-center">Hakkımızda</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          S&M Shoes, Türkiye&apos;nin dört bir yanına en kaliteli ve en yeni ayakkabıları ulaştırmak için kurulmuş modern bir e-ticaret platformudur.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
          Kurulduğumuz günden bu yana, binlerce müşterimize hızlı teslimat, uygun fiyat ve %100 orijinal ürün garantisi sunuyoruz. Geniş ürün yelpazemizle her zevke ve ihtiyaca uygun ayakkabılar bulabilirsiniz.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Vizyonumuz; dijital dünyada güvenilir, yenilikçi ve müşteri odaklı bir marka olarak sektörde öncü olmaktır. Sizlere daha iyi hizmet sunabilmek için kendimizi sürekli geliştiriyoruz.
        </p>
        <div className="mt-8 text-center">
          <Link href="/contact" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">Bize Ulaşın</Link>
        </div>
      </div>
    </div>
  );
} 