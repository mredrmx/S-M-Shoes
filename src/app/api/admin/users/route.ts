import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "ekinler_bas_vermeden_kor_buzagı_topallamazmıs";

async function isAdmin(req: NextRequest) {
  // Önce Authorization header'ından token al
  const auth = req.headers.get("authorization");
  let token: string | null = auth;
  if (token && token.startsWith("Bearer ")) token = token.replace("Bearer ", "");
  
  // Eğer Authorization header'ında yoksa cookie'den al
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get("token")?.value || null;
  }
  
  if (!token) return false;
  
  try {
    const user = jwt.verify(token, JWT_SECRET) as { role: string };
    return user.role.toLowerCase() === "admin";
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            addresses: true
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Kullanıcılar yüklenirken hata:", error);
    return NextResponse.json(
      { error: "Kullanıcılar yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    
    if (!id) {
      return NextResponse.json({ error: "Kullanıcı ID zorunludur." }, { status: 400 });
    }

    // Kullanıcının kendisini silmesini engelle
    const auth = req.headers.get("authorization");
    let token: string | null = auth;
    if (token && token.startsWith("Bearer ")) token = token.replace("Bearer ", "");
    
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value || null;
    }
    
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      if (decoded.id === id) {
        return NextResponse.json({ error: "Kendi hesabınızı silemezsiniz." }, { status: 400 });
      }
    }

    // Kullanıcıyı sil (onDelete: SetNull sayesinde siparişler ve adresler silinmeyecek, userId null olacaktır)
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Kullanıcı başarıyla silindi (İşlemleri anonimleştirildi)." });
  } catch (error) {
    console.error("Kullanıcı silinirken hata:", error);
    return NextResponse.json(
      { error: "Kullanıcı silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  
  try {
    const { id, action } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Kullanıcı ID zorunludur." }, { status: 400 });
    }

    if (action === "rejectDelete") {
      await prisma.user.update({
        where: { id: Number(id) },
        data: { deleteRequest: false }
      });
      return NextResponse.json({ success: true, message: "Silme talebi reddedildi." });
    }

    return NextResponse.json({ error: "Geçersiz aksiyon." }, { status: 400 });
  } catch (error) {
    console.error("Kullanıcı güncellenirken hata:", error);
    return NextResponse.json(
      { error: "Kullanıcı güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
} 