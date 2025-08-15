# Order Management API

Sistem **Order Management API** sederhana menggunakan **Node.js (Express)**, **Prisma ORM**, dan **MySQL**.

## 📌 Fitur
- Login & Register (JWT Authentication)
- CRUD Produk (Admin only)
- Customer membuat pesanan, stok otomatis berkurang
- Riwayat pesanan customer
- Validasi input (Zod)
- Error handling & role-based authorization

---

## 📂 Tech Stack
- **Backend**: Node.js, Express
- **ORM**: Prisma
- **Database**: MySQL
- **Auth**: JWT + bcrypt
- **Validation**: Zod

---

## ⚙️ Persiapan
- Node.js **>= 18**
- MySQL aktif
- Buat database baru (misal: `order_management`)
- `.env` sudah diisi seperti contoh

---

## 📄 .env Example
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DBNAME"
PORT=5000
JWT_SECRET="your_jwt_secret"

ADMIN_PASSWORD=admin_password
CUSTOMER_PASSWORD=customer_password
```
---
---

## 🚀 Instalasi & Menjalankan
# 1. Clone repository
git clone https://github.com/fjrRA/backend-managament.git
cd backend-managament

# 2. Install dependencies
npm install

# 3. Generate Prisma Client
npx prisma generate

# 4. Jalankan migrasi database
npx prisma migrate dev --name init

# 5. Jalankan seed data awal (admin, customer, produk)
npm run seed

# 6. Jalankan server
npm run dev

