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
  const { searchParams } = new URL(req.url);
  const isPing = searchParams.get("ping") === "true";

  // 1. Ping / Heartbeat isteklerini doğrudan işle (Misafir veya Üye)
  if (isPing) {
    try {
      if (userId) {
        // Aktiflik durumunu güncelle
        await prisma.user.update({
          where: { id: userId },
          data: { lastActive: new Date() }
        });
        
        // Eğer admin ise direkt success dön
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user && user.role.toLowerCase() === "admin") {
          return NextResponse.json({ success: true, role: "admin" });
        }
      }

      // Müşteri / Misafir pingi için admin durumunu çek
      const adminUser = await prisma.user.findFirst({
        where: { role: "admin" }
      });

      if (!adminUser) {
        return NextResponse.json({ success: true, admin: null });
      }

      let isOnline = false;
      if (adminUser.lastActive) {
        const diff = new Date().getTime() - new Date(adminUser.lastActive).getTime();
        isOnline = diff < 1000 * 60 * 2;
      }

      return NextResponse.json({ 
        success: true, 
        admin: { id: adminUser.id, name: adminUser.name, surname: adminUser.surname, isOnline } 
      });
    } catch (error) {
      console.error("Ping error:", error);
      return NextResponse.json({ error: "Ping basarisiz." }, { status: 500 });
    }
  }

  // 2. Normal Mesaj çekme istekleri (Kesinlikle Giriş Yapmış Olmalı)
  if (!userId) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  
  try {
    // Aktiflik durumunu güncelle
    const user = await prisma.user.update({
      where: { id: userId },
      data: { lastActive: new Date() }
    });

    if (user.role.toLowerCase() !== "admin") {
      // Müşteri: Sadece ilk admin ile olan mesajlaşmaları getir
      const adminUser = await prisma.user.findFirst({
        where: { role: "admin" }
      });

      if (!adminUser) {
        return NextResponse.json({ messages: [], admin: null });
      }

      // Admin çevrimiçi mi? (Son 2 dakika aktiflik kontrolü)
      let isOnline = false;
      if (adminUser.lastActive) {
        const diff = new Date().getTime() - new Date(adminUser.lastActive).getTime();
        isOnline = diff < 1000 * 60 * 2;
      }

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: adminUser.id },
            { senderId: adminUser.id, receiverId: userId }
          ]
        },
        include: { sender: true, receiver: true },
        orderBy: { createdAt: "asc" },
      });

      return NextResponse.json({ 
        messages, 
        admin: { id: adminUser.id, name: adminUser.name, surname: adminUser.surname, isOnline } 
      });
    } else {
      // Admin: Kendisiyle ilgili tüm mesajları getir
      const messages = await prisma.message.findMany({
        where: { OR: [{ senderId: userId }, { receiverId: userId }] },
        include: { sender: true, receiver: true },
        orderBy: { createdAt: "asc" },
      });
      return NextResponse.json({ messages });
    }
  } catch (error) {
    console.error("Messages GET error:", error);
    return NextResponse.json({ error: "Mesajlar yüklenemedi." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  
  const { receiverId, content } = await req.json();
  if (!receiverId || !content) {
    return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
  }
  
  try {
    // Aktiflik durumunu güncelle
    await prisma.user.update({
      where: { id: userId },
      data: { lastActive: new Date() }
    });

    const message = await prisma.message.create({
      data: { senderId: userId, receiverId: Number(receiverId), content },
      include: { sender: true, receiver: true },
    });
    
    return NextResponse.json({ message });
  } catch (error) {
    console.error("Messages POST error:", error);
    return NextResponse.json({ error: "Mesaj gönderilemedi." }, { status: 500 });
  }
} 