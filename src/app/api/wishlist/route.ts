import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "ekinler_bas_vermeden_kor_buzagı_topallamazmıs";

async function getUserId(req: NextRequest) {
  // Önce Authorization header'ından token al
  const auth = req.headers.get("authorization");
  let token: string | null = auth;
  if (token && token.startsWith("Bearer ")) token = token.replace("Bearer ", "");
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get("token")?.value || null;
  }
  if (!token) return null;
  try {
    const user = jwt.verify(token, JWT_SECRET) as { id: number };
    return user.id;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const wishlist = await prisma.wishlist.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ wishlist });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "Ürün ID zorunlu." }, { status: 400 });
  try {
    const exists = await prisma.wishlist.findUnique({ where: { userId_productId: { userId, productId } } });
    if (exists) return NextResponse.json({ error: "Zaten istek listenizde." }, { status: 409 });
    const entry = await prisma.wishlist.create({ data: { userId, productId } });
    return NextResponse.json({ success: true, entry });
  } catch {
    return NextResponse.json({ error: "İstek listesine eklenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "Ürün ID zorunlu." }, { status: 400 });
  try {
    await prisma.wishlist.delete({ where: { userId_productId: { userId, productId } } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "İstek listesinden çıkarılırken bir hata oluştu." }, { status: 500 });
  }
} 