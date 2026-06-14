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
  const { searchParams } = new URL(req.url);
  const productId = Number(searchParams.get("productId"));
  if (!productId) return NextResponse.json({ error: "Ürün ID zorunlu." }, { status: 400 });
  const comments = await prisma.comment.findMany({
    where: { productId },
    include: { user: { select: { name: true, surname: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ comments });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  const { productId, rating, text } = await req.json();
  if (!productId || !rating || !text) return NextResponse.json({ error: "Tüm alanlar zorunlu." }, { status: 400 });
  
  try {
    // Kullanıcının bu ürünü sipariş edip etmediğini kontrol et
    const hasOrdered = await prisma.order.findFirst({
      where: {
        userId,
        items: {
          some: {
            productId: Number(productId)
          }
        }
      }
    });

    if (!hasOrdered) {
      return NextResponse.json(
        { error: "Yorum yazmak için önce bu ürünü sipariş etmiş olmalısınız." },
        { status: 403 }
      );
    }

    const comment = await prisma.comment.create({
      data: { userId, productId: Number(productId), rating: Number(rating), text },
      include: { user: { select: { name: true, surname: true } } },
    });
    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error("Yorum ekleme hatası:", error);
    return NextResponse.json({ error: "Yorum eklenirken bir hata oluştu." }, { status: 500 });
  }
} 