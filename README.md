# S&M Shoes - Next.js Ayakkabı E-Ticaret Projesi

## Proje Tanımı
S&M Shoes, modern ve kullanıcı dostu bir ayakkabı e-ticaret platformudur. Proje, Türkiye genelinde hızlı teslimat ve güvenilir alışveriş deneyimi sunmak amacıyla geliştirilmiştir. Kullanıcılar ürünleri inceleyebilir, sepete ekleyebilir, adres yönetimi yapabilir, sipariş oluşturabilir ve sipariş geçmişini görüntüleyebilir. Admin paneli ile ürün, sipariş ve kullanıcı yönetimi kolayca yapılabilir.

## Kullanılan Teknolojiler
- **Next.js** (App Router, SSR/CSR)
- **Prisma ORM** (Veritabanı işlemleri için)
- **SQLite** (Varsayılan olarak, kolay kurulum için)
- **TailwindCSS** (Tasarım ve responsive arayüz)
- **Shadcn UI** (Bileşen kütüphanesi)
- **JWT** (Kullanıcı kimlik doğrulama)
- **React Context** (Global state yönetimi)
- **Diğerleri:**
  - @headlessui/react, @heroicons/react, lucide-react, bcryptjs, jose, class-variance-authority, clsx, sonner, tailwind-merge

## Kurulum Talimatları

1. **Projeyi klonlayın:**
   ```bash
   git clone https://github.com/mredrmx/S-M-Shoes.git
   cd S-M-Shoes
   ```
2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```
3. **Ortam değişkenlerini ayarlayın:**
   Ana dizinde `.env.local` dosyası oluşturun ve aşağıdaki örneğe göre doldurun:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET="gizli_bir_anahtar"
   ```
4. **Veritabanı migrasyonlarını ve seed işlemlerini çalıştırın:**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   npm run seed # Test kullanıcıları ve ürünler için
   ```
5. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

## Admin Giriş Bilgileri (Test İçin)

Aşağıdaki admin hesabı, test ve demo amaçlıdır:

- **E-posta:** a@a
- **Şifre:** a

Ek olarak, iki normal kullanıcı da otomatik olarak oluşturulur:
- **E-posta:** b@b / Şifre: b
- **E-posta:** c@c / Şifre: c

> Not: Gerçek deploy öncesi bu hesapları değiştirmeniz önerilir.

## Ekran Görüntüleri



## Katkı ve Lisans
- Katkı yapmak için fork'layıp pull request gönderebilirsiniz.

---

Her türlü soru ve destek için GitHub Issues bölümünü kullanabilirsiniz.
