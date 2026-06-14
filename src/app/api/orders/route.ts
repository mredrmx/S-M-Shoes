import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "ekinler_bas_vermeden_kor_buzagı_topallamazmıs";

async function getUserIdFromRequest(req?: NextRequest): Promise<number | null> {
    let token: string | undefined;
    if (req) {
        const authHeader = req.headers.get("authorization");
        token = authHeader?.split(" ")[1];
    }
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

export async function GET(req: NextRequest) {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: { 
                items: { include: { product: true } },
                address: true,
                returnRequests: true
            },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json({ orders });
    } catch {
        return NextResponse.json({ error: "Siparişler yüklenemedi." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  const body = await req.json();
  const { items, addressId, guestAddress } = body;

  if (!items || items.length === 0) {
    return NextResponse.json(
      { error: "Sepet boş olamaz" },
      { status: 400 }
    );
  }

  if (!userId && !guestAddress) {
    return NextResponse.json(
      { error: "Misafir siparişi için adres bilgileri gereklidir." },
      { status: 400 }
    );
  }

  if (userId && !addressId) {
    return NextResponse.json(
      { error: "Adres seçimi zorunludur" },
      { status: 400 }
    );
  }

  try {
    // Stok kontrolü ve sipariş oluşturma işlemini bir transaction ile yapalım
    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Ürünlerin stoklarını kontrol et ve düşür
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: Number(item.productId) }
        });

        if (!product) {
          throw new Error(`Ürün bulunamadı (ID: ${item.productId})`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`${product.name} için yeterli stok yok. Mevcut stok: ${product.stock}`);
        }

        // Stoktan düş
        await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity }
        });
      }

      // 2. Adres belirleme (Kayıtlı kullanıcı veya Misafir)
      let finalAddressId = addressId;
      if (!userId && guestAddress) {
        const newAddr = await tx.address.create({
          data: {
            userId: null,
            email: guestAddress.email || null,
            title: guestAddress.title || "Misafir Adresi",
            recipientName: guestAddress.recipientName,
            recipientSurname: guestAddress.recipientSurname,
            phone: guestAddress.phone,
            city: guestAddress.city,
            district: guestAddress.district,
            neighborhood: guestAddress.neighborhood,
            fullAddress: guestAddress.fullAddress,
          }
        });
        finalAddressId = newAddr.id;
      } else if (userId && addressId) {
        // Kayıtlı kullanıcının adresi gerçekten ona ait mi kontrol et
        const address = await tx.address.findFirst({
          where: { id: addressId, userId: userId },
        });
        if (!address) {
          throw new Error("Geçersiz adres seçimi.");
        }
      }

      // 3. Siparişi oluştur
      return await tx.order.create({
        data: {
          userId: userId || null,
          addressId: finalAddressId,
          items: {
            create: items.map((item: { productId: number; quantity: number; price: number; size?: string; color?: string }) => ({
              productId: Number(item.productId),
              quantity: item.quantity,
              price: item.price,
              size: item.size ? String(item.size) : null,
              color: item.color ? String(item.color) : null,
            })),
          },
        },
        include: {
          items: true,
        },
      });
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Sipariş oluşturulamadı" },
      { status: 400 }
    );
  }
} 