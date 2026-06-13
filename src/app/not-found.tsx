"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 px-4">
      <h1 className="text-6xl font-bold text-blue-700 dark:text-blue-300 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-4">Sayfa Bulunamadı</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md">
        Aradığınız sayfa bulunamadı veya kaldırılmış olabilir. Ana sayfaya dönerek alışverişe devam edebilirsiniz.
      </p>
      <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">Ana Sayfaya Dön</Link>
    </div>
  );
} 