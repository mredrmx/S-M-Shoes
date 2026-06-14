"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function PageAnimatePresence({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="animate-page-fade flex-1 flex flex-col">
      {children}
    </div>
  );
}
