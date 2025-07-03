import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  let products;
  if (category && category !== "Tüm Ürünler") {
    products = await prisma.product.findMany({ where: { category } });
  } else {
    products = await prisma.product.findMany();
  }
  return NextResponse.json({ products });
} 