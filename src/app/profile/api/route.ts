import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "ekinler_bas_vermeden_kor_buzagı_topallamazmıs";

async function getUserIdFromToken(request: NextRequest): Promise<number | null> {
    // Önce Authorization header'ından token al
    const authHeader = request.headers.get("authorization");
    let token = authHeader?.split(" ")[1];
    
    // Eğer Authorization header'ında yoksa cookie'den al
    if (!token) {
        const cookieStore = await cookies();
        token = cookieStore.get('token')?.value;
    }
    
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        return decoded.id;
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
        }
    
        const user = await prisma.user.findUnique({ where: { id: userId } });
    
        if (!user) {
          return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
        }
        
        // Şifreyi yanıttan çıkar
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json({ user: userWithoutPassword });
      } catch {
        return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
      }
}

export async function PUT(req: NextRequest) {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  try {
    const { name, surname } = await req.json();

    if (!name || !surname) {
      return NextResponse.json({ error: 'Ad ve soyad alanları zorunludur.' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, surname },
    });

    return NextResponse.json({ user: { id: updatedUser.id, name: updatedUser.name, surname: updatedUser.surname, email: updatedUser.email, role: updatedUser.role } });
  } catch {
    return NextResponse.json(
      { error: "Profil güncellenemedi" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }
  try {
    await prisma.user.delete({ where: { id: userId } });
    // Çıkış için token'ı temizle
    const response = NextResponse.json({ success: true });
    response.cookies.set('token', '', { maxAge: 0 });
    return response;
  } catch {
    return NextResponse.json({ error: 'Hesap silinemedi' }, { status: 500 });
  }
} 