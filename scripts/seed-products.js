const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname, '../data001.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const productsObj = JSON.parse(raw);
  const products = Object.values(productsObj);

  for (const prod of products) {
    try {
      // Renk ve boyutları otomatik tamamla
      let colors = prod.colors;
      let sizes = prod.sizes;
      if (!colors || colors === '' || colors === '[]') {
        colors = JSON.stringify(["Beyaz", "Siyah", "Kırmızı"]);
      }
      if (!sizes || sizes === '' || sizes === '[]') {
        sizes = JSON.stringify([37, 38, 39, 40, 41, 42, 43, 44, 45]);
      }
      await prisma.product.create({
        data: {
          name: prod.name,
          description: prod.name, // Açıklama yoksa isim kullan
          price: Number(prod.price),
          stock: prod.items_left || 0,
          imageUrl: prod.imageURL,
          brand: prod.brand || '',
          category: prod.category || '',
          colors,
          sizes,
          images: JSON.stringify([prod.imageURL]),
          featured: Boolean(prod.featured),
        }
      });
      console.log('Eklendi:', prod.name);
    } catch (e) {
      console.error('Hata:', prod.name, e.message);
    }
  }
  await prisma.$disconnect();
}

main(); 