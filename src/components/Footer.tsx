"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setOpenSection(section);
    }
  };

  return (
    <footer className="w-full bg-white/80 dark:bg-gray-900/85 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-800/50 py-12 px-6 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-gray-600 dark:text-gray-300 text-sm">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-black tracking-wider text-blue-600 dark:text-blue-400">
            S&M SHOES
          </h3>
          <p className="leading-relaxed text-gray-500 dark:text-gray-400">
            Türkiye'nin öncü ve en tarz ayakkabı mağazası. Kalite, güvenilirlik ve ekspres teslimat ile adımlarınızı şıklıkla buluşturuyoruz.
          </p>
          <div className="flex space-x-4 pt-2">
            <a 
              href="https://instagram.com/smshoes" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-pink-500 dark:hover:text-pink-400 hover:scale-110 hover:shadow-md transition-all"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.41.59.22 1.01.48 1.45.92.44.44.7.86.92 1.45.17.46.354 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.41 2.43-.22.59-.48 1.01-.92 1.45-.44.44-.86.7-1.45.92-.46.17-1.26.354-2.43.41-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.43-.41-.59-.22-1.01-.48-1.45-.92-.44-.44-.7-.86-.92-1.45-.17-.46-.354-1.26-.41-2.43C2.212 15.784 2.2 15.4 2.2 12s.012-3.584.07-4.85c.056-1.17.24-1.97.41-2.43.22-.59.48-1.01.92-1.45.44-.44.86-.7 1.45-.92.46-.17 1.26-.354 2.43-.41C8.416 2.212 8.8 2.2 12 2.2zm0-2.2C8.736 0 8.332.012 7.052.07 5.77.128 4.87.31 4.13.54c-.77.24-1.42.56-2.07 1.21-.65.65-.97 1.3-1.21 2.07-.23.74-.412 1.64-.47 2.92C.012 8.332 0 8.736 0 12c0 3.264.012 3.668.07 4.948.058 1.28.24 2.18.47 2.92.24.77.56 1.42 1.21 2.07.65.65 1.3.97 2.07 1.21.74.23 1.64.412 2.92.47C8.332 23.988 8.736 24 12 24c3.264 0 3.668-.012 4.948-.07 1.28-.058 2.18-.24 2.92-.47.77-.24 1.42-.56 2.07-1.21.65-.65.97-1.3 1.21-2.07.23-.74.412-1.64.47-2.92.058-1.28.07-1.684.07-4.948 0-3.264-.012-3.668-.07-4.948-.058-1.28-.24-2.18-.47-2.92-.24-.77-.56-1.42-1.21-2.07-.65-.65-1.3-.97-2.07-1.21-.74-.23-1.64-.412-2.92-.47C15.668.012 15.264 0 12 0z"/><path d="M12 5.838A6.162 6.162 0 1 0 12 18.162 6.162 6.162 0 1 0 12 5.838zm0 10.162A4 4 0 1 1 12 8a4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
            </a>
            <a 
              href="https://facebook.com/smshoes" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-blue-600 dark:hover:text-blue-500 hover:scale-110 hover:shadow-md transition-all"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
            </a>
            <a 
              href="https://twitter.com/smshoes" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Twitter"
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-blue-400 dark:hover:text-blue-400 hover:scale-110 hover:shadow-md transition-all"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.116 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div>
          <button 
            onClick={() => toggleSection('links')} 
            className="w-full flex items-center justify-between text-left font-bold text-gray-900 dark:text-white pb-3 md:pb-0 border-b border-gray-100 dark:border-gray-800 md:border-none focus:outline-none"
          >
            <span>Hızlı Linkler</span>
            <span className="md:hidden text-lg">{openSection === 'links' ? '−' : '+'}</span>
          </button>
          <ul className={`space-y-2 mt-4 transition-all duration-300 md:block ${openSection === 'links' ? 'block' : 'hidden'}`}>
            <li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Anasayfa</Link></li>
            <li><Link href="/products" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tüm Ürünler</Link></li>
            <li><Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Hakkımızda</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">İletişim</Link></li>
            <li><Link href="/faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">S.S.S.</Link></li>
            <li><Link href="/policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">İade & Teslimat</Link></li>
          </ul>
        </div>

        {/* Contact Info Section */}
        <div>
          <button 
            onClick={() => toggleSection('contact')} 
            className="w-full flex items-center justify-between text-left font-bold text-gray-900 dark:text-white pb-3 md:pb-0 border-b border-gray-100 dark:border-gray-800 md:border-none focus:outline-none"
          >
            <span>İletişim</span>
            <span className="md:hidden text-lg">{openSection === 'contact' ? '−' : '+'}</span>
          </button>
          <ul className={`space-y-3 mt-4 transition-all duration-300 md:block ${openSection === 'contact' ? 'block' : 'hidden'}`}>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 flex-shrink-0">📞</span>
              <a href="tel:+905551112233" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">+90 555 111 22 33</a>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 flex-shrink-0">✉️</span>
              <a href="mailto:info@smshoes.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">info@smshoes.com</a>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 flex-shrink-0">📍</span>
              <span className="text-gray-500 dark:text-gray-400">Karabük, Türkiye</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 flex-shrink-0">🕒</span>
              <span className="text-gray-500 dark:text-gray-400 text-xs">Pzt - Cum: 09:00 - 18:00</span>
            </li>
          </ul>
        </div>

        {/* Payment and Security Section */}
        <div>
          <button 
            onClick={() => toggleSection('payment')} 
            className="w-full flex items-center justify-between text-left font-bold text-gray-900 dark:text-white pb-3 md:pb-0 border-b border-gray-100 dark:border-gray-800 md:border-none focus:outline-none"
          >
            <span>Ödeme ve Güvenlik</span>
            <span className="md:hidden text-lg">{openSection === 'payment' ? '−' : '+'}</span>
          </button>
          <div className={`mt-4 space-y-4 transition-all duration-300 md:block ${openSection === 'payment' ? 'block' : 'hidden'}`}>
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
              <svg width="20" height="20" fill="currentColor" className="text-emerald-600 dark:text-emerald-500" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5zm2 0v10h12V5H4zm3 2h6v2H7V7zm0 4h4v2H7v-2z"/>
              </svg>
              <span className="font-medium">Kapıda Nakit / Kart</span>
            </div>
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
              <svg width="20" height="20" fill="currentColor" className="text-blue-500" viewBox="0 0 20 20">
                <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm-1 15l-5-5 1.414-1.414L9 12.172l5.293-5.293 1.414 1.414L9 15z"/>
              </svg>
              <span className="text-xs">256-bit SSL Koruma</span>
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              Siparişleriniz en hızlı şekilde kargoya verilir ve güvenle kapınızda ödeme imkanı ile teslim edilir.
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-100 dark:border-gray-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 dark:text-gray-500 gap-4">
        <div>
          © {new Date().getFullYear()} S&M SHOES | Tüm hakları saklıdır.
        </div>
        <div className="flex gap-4">
          <Link href="/policy" className="hover:underline">Gizlilik Politikası</Link>
          <Link href="/policy" className="hover:underline">Mesafeli Satış Sözleşmesi</Link>
        </div>
      </div>
    </footer>
  );
}
