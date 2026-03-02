# Yapılacaklar

## Production'da Admin paneli görünmüyorsa

- [ ] **Hangi sayfaya düşüyorsun?**
  - **Login** → Session production'da tutulmuyor. Kontrol et:
    - `NEXTAUTH_URL=https://sevginserbest.com` (trailing slash yok)
    - `NEXTAUTH_SECRET` güçlü ve aynı (env'de set)
    - Cookie: production'da HTTPS olduğu için `secure` ve domain doğru olmalı (NextAuth varsayılanı genelde yeter)
  - **Access Denied** → Veritabanındaki kullanıcı rolü `SUPER_ADMIN` değil. Düzelt:
    - Sunucuda proje dizininde: `npm run fix-admin` (veya `ADMIN_EMAIL=senin@email.com npm run fix-admin`). İlk seferde `npx tsx` gerekebilir: `npm install -D tsx`.
    - Alternatif: Veritabanında doğrudan SQL çalıştır: `UPDATE "User" SET role = 'SUPER_ADMIN' WHERE email = 'admin@sevginserbest.com';` (e-postayı kendi adresinle değiştir).

## E-posta / Davet sistemi

- [ ] **Resend domain ve DNS ayarı**
  - Resend panelinde **Domain** ekle: Name = `sevginserbest.com`, Region = Ireland (veya uygun bölge).
  - **+ Add Domain** sonrası çıkan **DNS Records** (MX, SPF, DKIM/TXT) kayıtlarını domain sağlayıcıda (Contabo veya domain panelinde) ekle.
  - Doğrulama tamamlanınca davet mailleri `noreply@sevginserbest.com` (veya seçtiğin adres) üzerinden gidebilir.

---

## Tamamlanan / Mevcut

- **Admin kendi hesabını yönetebilir**  
  Admin Panel → **My Profile** (`/admin/profile`): ad (Full Name), e-posta (Email Address) ve **şifre değişikliği** (mevcut şifre + yeni şifre) yapılabiliyor.
