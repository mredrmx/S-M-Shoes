"use client";
import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import AccountLayout from "@/components/AccountLayout";
import Link from "next/link";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import Image from "next/image";

export default function WishlistPage() {
  const { wishlist, loading, removeFromWishlist } = useWishlist();

  return (
    <AccountLayout>
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">İstek Listem</h1>
      {loading ? (
        <div className="text-center py-16">Yükleniyor...</div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <HeartSolid className="mx-auto text-gray-400 dark:text-gray-500 mb-4 w-12 h-12" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">İstek Listeniz Boş</h2>
          <p className="text-gray-500 mt-2">Beğendiğiniz ürünleri kalp ikonuna tıklayarak listenize ekleyebilirsiniz.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col items-center border border-gray-100 dark:border-gray-700 relative">
              <button
                onClick={() => removeFromWishlist(item.productId)}
                className="absolute top-2 left-2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 hover:bg-pink-100 dark:hover:bg-pink-900 transition-colors shadow-md"
                aria-label="İstek Listesinden Çıkar"
              >
                <HeartSolid className="w-5 h-5 text-pink-500" />
              </button>
              <Link href={`/products/${item.productId}`} className="flex flex-col items-center w-full">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                  width={64}
                  height={64}
                  unoptimized
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 text-center">{item.product.name}</h3>
                <span className="text-base font-bold text-blue-600 dark:text-blue-400">₺{item.product.price}</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
} 