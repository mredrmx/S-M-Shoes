import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "ekinler_bas_vermeden_kor_buzagı_topallamazmıs";

async function getUserId(req: NextRequest) {
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

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const { orderId, reason } = await req.json();
  if (!orderId || !reason) return NextResponse.json({ error: "Tüm alanlar zorunlu." }, { status: 400 });
  try {
    // Sipariş gerçekten bu kullanıcıya mı ait kontrolü
    const order = await prisma.order.findUnique({ where: { id: orderId, userId } });
    if (!order) return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 });
    // ReturnRequest oluştur
    const reqObj = await prisma.returnRequest.create({
      data: { orderId, userId, reason, status: "İptal Talebi" },
    });
    // Siparişin durumu DEĞİŞTİRİLMEYECEK, admin onaylayınca değişecek
    return NextResponse.json({ success: true, request: reqObj });
  } catch {
    return NextResponse.json({ error: "İptal talebi oluşturulamadı." }, { status: 500 });
  }
} 