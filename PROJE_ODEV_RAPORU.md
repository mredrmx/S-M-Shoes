# S&M Shoes E-Ticaret Projesi Ödev Raporu

## 1. Proje Konusu ve Amacı

### Proje Konusu
S&M Shoes, modern web teknolojileri kullanılarak geliştirilmiş kapsamlı bir ayakkabı e-ticaret platformudur. Proje, Next.js framework'ü üzerine inşa edilmiş olup, kullanıcı dostu arayüzü ve güçlü backend yapısı ile tam fonksiyonel bir e-ticaret deneyimi sunmaktadır.

### Proje Amacı
Bu proje, aşağıdaki temel amaçları gerçekleştirmek üzere tasarlanmıştır:

- **Modern E-Ticaret Deneyimi**: Kullanıcılara sezgisel ve responsive bir alışveriş deneyimi sunmak
- **Kapsamlı Ürün Yönetimi**: Ayakkabı kategorilerinde detaylı ürün bilgileri, renk/boyut seçenekleri ve stok takibi
- **Güvenli Kullanıcı Yönetimi**: JWT tabanlı kimlik doğrulama sistemi ile güvenli kullanıcı hesapları
- **Gelişmiş Sipariş Sistemi**: Adres yönetimi, sipariş takibi ve iptal/geri gönderim işlemleri
- **Admin Paneli**: Ürün, sipariş ve kullanıcı yönetimi için kapsamlı admin arayüzü
- **Mobil Uyumluluk**: Tüm cihazlarda optimal kullanıcı deneyimi

### Çözülen Problemler
- Geleneksel e-ticaret sitelerinin karmaşık arayüzleri
- Mobil cihazlarda zayıf kullanıcı deneyimi
- Yetersiz ürün detay bilgileri
- Karmaşık sipariş süreçleri
- Admin işlemlerinin zorluğu

## 2. Planlama ve Geliştirme Süreci

### Proje Planlama Aşamaları

#### 1. Analiz ve Tasarım Fazı
- **Gereksinim Analizi**: E-ticaret platformunun temel ihtiyaçlarının belirlenmesi
- **Veritabanı Tasarımı**: Prisma ORM ile ilişkisel veritabanı şemasının oluşturulması
- **UI/UX Tasarımı**: TailwindCSS ve Shadcn UI ile modern arayüz tasarımı
- **Mimari Kararlar**: Next.js App Router, Context API ve JWT kimlik doğrulama

#### 2. Geliştirme Fazı
- **Backend API Geliştirme**: RESTful API endpoint'lerinin oluşturulması
- **Frontend Bileşenleri**: React bileşenlerinin modüler yapıda geliştirilmesi
- **Veritabanı Entegrasyonu**: Prisma ile veritabanı işlemlerinin implementasyonu
- **Kimlik Doğrulama Sistemi**: JWT tabanlı güvenlik sisteminin kurulması

#### 3. Test ve Optimizasyon Fazı
- **Fonksiyonel Testler**: Tüm özelliklerin test edilmesi
- **Responsive Tasarım**: Mobil uyumluluk optimizasyonu
- **Performans İyileştirmeleri**: Kod optimizasyonu ve hız artırımı
- **Güvenlik Kontrolleri**: Kimlik doğrulama ve yetkilendirme testleri

### Geliştirme Metodolojisi
- **Agile Yaklaşım**: İteratif geliştirme süreci
- **Modüler Tasarım**: Yeniden kullanılabilir bileşenler
- **Version Control**: Git ile kod versiyonlama
- **Continuous Integration**: Düzenli test ve build süreçleri

## 3. Modüller ve İşlevleri

### 3.1 Kullanıcı Yönetimi Modülü
**Dosya Konumu**: `src/context/AuthContext.tsx`, `src/app/api/login/route.ts`, `src/app/api/register/route.ts`

**İşlevleri**:
- Kullanıcı kayıt ve giriş işlemleri
- JWT token yönetimi
- Rol tabanlı yetkilendirme (Admin/User)
- Oturum durumu takibi
- Güvenli şifre hashleme (bcryptjs)

### 3.2 Ürün Yönetimi Modülü
**Dosya Konumu**: `src/app/api/products/route.ts`, `src/app/products/page.tsx`, `src/app/products/[id]/page.tsx`

**İşlevleri**:
- Ürün listeleme ve filtreleme
- Detaylı ürün görüntüleme
- Kategori bazlı ürün gruplandırma
- Renk ve boyut seçenekleri
- Stok takibi
- Öne çıkan ürünler

### 3.3 Sepet Yönetimi Modülü
**Dosya Konumu**: `src/context/CartContext.tsx`, `src/components/CartPopup.tsx`

**İşlevleri**:
- Ürün ekleme/çıkarma
- Miktar güncelleme
- Toplam fiyat hesaplama
- Sepet durumu saklama (localStorage)
- Responsive sepet popup'ı

### 3.4 Sipariş Yönetimi Modülü
**Dosya Konumu**: `src/app/api/orders/route.ts`, `src/app/checkout/page.tsx`, `src/app/orders/page.tsx`

**İşlevleri**:
- Sipariş oluşturma
- Sipariş geçmişi görüntüleme
- Sipariş durumu takibi
- Sipariş iptal işlemleri
- Adres seçimi ve yönetimi

### 3.5 Adres Yönetimi Modülü
**Dosya Konumu**: `src/app/addresses/page.tsx`, `src/components/AddressPanel.tsx`, `src/app/api/addresses/route.ts`

**İşlevleri**:
- Çoklu adres ekleme/düzenleme
- Türkiye adres sistemi entegrasyonu
- Varsayılan adres belirleme
- Adres doğrulama
- İl/ilçe/mahalle seçimi

### 3.6 Admin Paneli Modülü
**Dosya Konumu**: `src/app/admin/`, `src/app/api/admin/`

**İşlevleri**:
- Ürün ekleme/düzenleme/silme
- Sipariş durumu güncelleme
- Kullanıcı yönetimi
- İstatistik görüntüleme
- Admin yetki kontrolü

### 3.7 İstek Listesi Modülü
**Dosya Konumu**: `src/context/WishlistContext.tsx`, `src/app/wishlist/page.tsx`, `src/app/api/wishlist/route.ts`

**İşlevleri**:
- Ürün favorilere ekleme/çıkarma
- İstek listesi görüntüleme
- Favori ürün takibi
- Kullanıcı bazlı favori yönetimi

### 3.8 Mesajlaşma Modülü
**Dosya Konumu**: `src/components/ChatPopup.tsx`, `src/app/api/messages/route.ts`

**İşlevleri**:
- Kullanıcılar arası mesajlaşma
- Gerçek zamanlı mesaj gönderimi
- Mesaj geçmişi görüntüleme
- Kullanıcı listesi

## 4. Kodlama Yapısı

### 4.1 Proje Mimarisi
```
lutfen-ecommerce-ayakkabi/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── admin/             # Admin paneli sayfaları
│   │   ├── components/        # Sayfa bileşenleri
│   │   └── globals.css        # Global stiller
│   ├── components/            # Yeniden kullanılabilir bileşenler
│   ├── context/               # React Context providers
│   ├── lib/                   # Yardımcı fonksiyonlar
│   └── middleware.ts          # Next.js middleware
├── prisma/                    # Veritabanı şeması ve migrasyonlar
├── public/                    # Statik dosyalar
└── scripts/                   # Seed ve test scriptleri
```

### 4.2 Kullanılan Teknolojiler

#### Frontend Teknolojileri
- **Next.js 15.3.4**: React framework'ü, App Router, SSR/CSR
- **React 19.0.0**: UI kütüphanesi
- **TypeScript 5.8.3**: Tip güvenliği
- **TailwindCSS 4**: Utility-first CSS framework
- **Shadcn UI**: Bileşen kütüphanesi
- **Lucide React**: İkon kütüphanesi

#### Backend Teknolojileri
- **Prisma ORM 6.10.1**: Veritabanı işlemleri
- **SQLite**: Veritabanı (geliştirme için)
- **JWT (jose)**: Kimlik doğrulama
- **bcryptjs**: Şifre hashleme

#### Geliştirme Araçları
- **ESLint**: Kod kalitesi
- **PostCSS**: CSS işleme
- **Turbopack**: Hızlı geliştirme sunucusu

### 4.3 Veritabanı Yapısı
Proje, 8 ana model içeren ilişkisel veritabanı kullanmaktadır:

- **User**: Kullanıcı bilgileri ve rolleri
- **Product**: Ürün detayları ve stok bilgileri
- **Order**: Sipariş bilgileri ve durumları
- **OrderItem**: Sipariş kalemleri
- **Address**: Kullanıcı adres bilgileri
- **Wishlist**: Favori ürünler
- **Comment**: Ürün yorumları
- **Message**: Kullanıcı mesajları
- **ReturnRequest**: İade talepleri

### 4.4 State Yönetimi
- **React Context API**: Global state yönetimi
- **LocalStorage**: Kullanıcı tercihleri ve sepet bilgileri
- **JWT Tokens**: Oturum yönetimi

## 5. Kazanımlar ve Değerlendirme

### 5.1 Öğrenilen Konular

#### Teknik Kazanımlar
- **Next.js App Router**: Modern Next.js routing sistemi
- **Prisma ORM**: Type-safe veritabanı işlemleri
- **JWT Authentication**: Güvenli kimlik doğrulama sistemi
- **React Context**: Global state yönetimi
- **TypeScript**: Tip güvenliği ve kod kalitesi
- **TailwindCSS**: Utility-first CSS yaklaşımı
- **Responsive Design**: Mobil uyumlu tasarım
- **API Development**: RESTful API tasarımı

#### Yazılım Geliştirme Becerileri
- **Modüler Tasarım**: Yeniden kullanılabilir bileşenler
- **Code Organization**: Temiz ve düzenli kod yapısı
- **Error Handling**: Hata yönetimi ve kullanıcı deneyimi
- **Performance Optimization**: Performans optimizasyonu
- **Security Best Practices**: Güvenlik en iyi uygulamaları

### 5.2 Karşılaşılan Zorluklar

#### Teknik Zorluklar
1. **Mobil Uyumluluk**: Farklı ekran boyutlarında optimal görünüm sağlama
2. **State Management**: Karmaşık state yönetimi ve senkronizasyon
3. **Database Relations**: İlişkisel veritabanı tasarımı ve optimizasyonu
4. **Authentication Flow**: JWT token yönetimi ve güvenlik
5. **Real-time Features**: Mesajlaşma sistemi implementasyonu

#### Çözüm Yaklaşımları
- **Responsive Design**: TailwindCSS breakpoint'leri ve özel CSS kuralları
- **Context API**: Merkezi state yönetimi ile veri senkronizasyonu
- **Prisma Relations**: İlişkisel veritabanı optimizasyonu
- **Middleware**: Güvenli route koruması
- **Optimistic Updates**: Kullanıcı deneyimi iyileştirmesi

### 5.3 Genel Değerlendirme

#### Başarılan Alanlar
- ✅ Tam fonksiyonel e-ticaret platformu
- ✅ Modern ve responsive tasarım
- ✅ Güvenli kimlik doğrulama sistemi
- ✅ Kapsamlı admin paneli
- ✅ Mobil uyumlu arayüz
- ✅ Performanslı veritabanı yapısı

#### Geliştirilebilir Alanlar
- 🔄 Ödeme sistemi entegrasyonu
- 🔄 Gerçek zamanlı bildirimler
- 🔄 Arama ve filtreleme optimizasyonu
- 🔄 SEO optimizasyonu
- 🔄 Test coverage artırımı

## 6. Bileşenlerin Genel İşleyişi

### 6.1 Ana Sayfa (Homepage)
**Dosya**: `src/app/page.tsx`

**İşleyiş**:
1. Sayfa yüklendiğinde öne çıkan ürünler API'den çekilir
2. Ürünler grid layout ile responsive olarak gösterilir
3. Her ürün kartında favori ekleme/çıkarma butonu bulunur
4. Ürün kartlarına tıklandığında detay sayfasına yönlendirilir
5. Mobil cihazlarda tek sütun, desktop'ta çoklu sütun görünümü

### 6.2 Ürün Detay Sayfası
**Dosya**: `src/app/products/[id]/page.tsx`

**İşleyiş**:
1. URL'den ürün ID'si alınır
2. Ürün detayları ve yorumlar paralel olarak çekilir
3. Renk ve boyut seçenekleri dinamik olarak gösterilir
4. Sepete ekleme işlemi Context API ile yönetilir
5. Yorum ekleme sistemi kullanıcı girişi gerektirir
6. Stok durumu gerçek zamanlı kontrol edilir

### 6.3 Sepet Popup Bileşeni
**Dosya**: `src/components/CartPopup.tsx`

**İşleyiş**:
1. Context API'den sepet verileri alınır
2. LocalStorage ile sepet durumu senkronize edilir
3. Ürün miktarı artırma/azaltma işlemleri
4. Toplam fiyat otomatik hesaplanır
5. Checkout sayfasına yönlendirme
6. Responsive tasarım ile mobil uyumlu

### 6.4 Admin Paneli
**Dosya**: `src/app/admin/`

**İşleyiş**:
1. Admin yetkisi kontrol edilir
2. Ürün yönetimi: CRUD işlemleri
3. Sipariş yönetimi: Durum güncelleme
4. Kullanıcı yönetimi: Listeleme ve silme
5. İstatistikler ve dashboard
6. Güvenli route koruması

### 6.5 Kimlik Doğrulama Sistemi
**Dosya**: `src/context/AuthContext.tsx`

**İşleyiş**:
1. JWT token localStorage'da saklanır
2. Token geçerliliği otomatik kontrol edilir
3. Route koruması middleware ile sağlanır
4. Kullanıcı bilgileri global state'te tutulur
5. Otomatik logout süresi yönetimi
6. Güvenli şifre hashleme

### 6.6 Adres Yönetimi
**Dosya**: `src/components/AddressPanel.tsx`

**İşleyiş**:
1. Türkiye adres verileri JSON'dan yüklenir
2. İl/İlçe/Mahalle hiyerarşik seçimi
3. Form validasyonu ve hata kontrolü
4. Adres kaydetme/güncelleme API çağrıları
5. Varsayılan adres belirleme
6. Responsive form tasarımı

### 6.7 Mesajlaşma Sistemi
**Dosya**: `src/components/ChatPopup.tsx`

**İşleyiş**:
1. Kullanıcı listesi API'den çekilir
2. Seçili kullanıcı ile mesaj geçmişi yüklenir
3. Yeni mesaj gönderme işlemi
4. Real-time mesaj güncelleme
5. Mesaj tarih/saat bilgileri
6. Kullanıcı dostu arayüz

Bu proje, modern web geliştirme teknolojilerini kullanarak kapsamlı bir e-ticaret platformu oluşturmayı başarmıştır. Kullanıcı deneyimi, güvenlik, performans ve mobil uyumluluk konularında başarılı sonuçlar elde edilmiştir. Proje, gerçek dünya uygulamalarında kullanılabilecek seviyede profesyonel bir yapıya sahiptir. 