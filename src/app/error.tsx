"use client";

import Link from "next/link";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 px-4">
      <h1 className="text-5xl font-bold text-red-600 dark:text-red-400 mb-4">Bir Hata Oluştu</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md">
        Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin veya ana sayfaya dönün.
      </p>
      <div className="flex gap-4">
        <button onClick={reset} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">Tekrar Dene</button>
        <Link href="/" className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 font-medium transition-colors">Ana Sayfa</Link>
      </div>
    </div>
  );
} 