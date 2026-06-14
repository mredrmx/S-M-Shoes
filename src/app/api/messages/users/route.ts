import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "ekinler_bas_vermeden_kor_buzagı_topallamazmıs";

async function getUserId(req: NextRequest) {
  // Önce Authorization header'ından token al
  const auth = req.headers.get("authorization");
  let token: string | null = auth;
  if (token && token.startsWith("Bearer ")) token = token.replace("Bearer ", "");
  
  // Eğer Authorization header'ında yoksa cookie'den al
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get('token')?.value || null;
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
  
  try {
    // Aktiflik durumunu güncelle
    const user = await prisma.user.update({
      where: { id: userId },
      data: { lastActive: new Date() }
    });

    if (user.role.toLowerCase() === "admin") {
      // Admin: Sadece kendisiyle mesajlaşmış olan kullanıcıları filtrele
      const chats = await prisma.message.findMany({
        where: { OR: [{ senderId: userId }, { receiverId: userId }] },
        select: { senderId: true, receiverId: true },
      });
      
      const userIds = Array.from(new Set(chats.flatMap(c => [c.senderId, c.receiverId]).filter(id => id !== userId)));
      
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, surname: true, email: true, lastActive: true },
      });

      return NextResponse.json({ users });
    } else {
      // Müşteri: Sadece adminleri listele (doğrudan adminle yazışacak)
      const admins = await prisma.user.findMany({
        where: { role: "admin" },
        select: { id: true, name: true, surname: true, email: true, lastActive: true }
      });
      return NextResponse.json({ users: admins });
    }
  } catch (error) {
    console.error("Messages users GET error:", error);
    return NextResponse.json({ error: "Kullanıcılar yüklenemedi." }, { status: 500 });
  }
} 