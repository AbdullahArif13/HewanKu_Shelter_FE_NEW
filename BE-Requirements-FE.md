# Backend Requirements for HewanKu Shelter FE

Dokumen ini menjelaskan kebutuhan backend agar Frontend HewanKu Shelter berfungsi dengan benar, berdasarkan kontrak endpoint dan payload yang sudah dipakai oleh FE.

> FE saat ini adalah sumber kebenaran untuk endpoint dan payload. Backend harus menyesuaikan dengan contract FE, bukan sebaliknya.

## 1. Autentikasi / User flow

### 1.1 POST `/shelter/login`
- Body:
  - `email` (string)
  - `password` (string)
- Response yang dibutuhkan FE:
  - `success: true` ketika berhasil
  - `data` berisi objek user yang paling tidak memuat `id`
- Catatan:
  - `id` digunakan oleh FE untuk request data shelter selanjutnya.

### 1.2 POST `/shelter/register`
- Body:
  - `email` (string)
  - `nama` (string) — gabungan `firstName` + `lastName`
  - `noTelepon` (string)
  - `password` (string)
  - `role` (string) — FE mengirim `user`, tetapi BE tidak boleh gagal bila `role` dianggap optional.
- Response yang dibutuhkan FE:
  - `success: true` ketika berhasil
  - minimal perlu memberi tahu FE bahwa registrasi sukses, sehingga FE dapat redirect ke halaman login.

### 1.3 POST `/shelter/forgot`
- Body:
  - `email` (string)
- Response yang dibutuhkan FE:
  - `success: true` jika OTP/email reset berhasil dikirim.
- Alur:
  1. FE -> `/shelter/forgot` untuk mengirim email reset.
  2. FE akan menavigasi user ke `/verify_code` dengan query `email`.

### 1.4 POST `/shelter/verify`
- Body:
  - `email` (string)
  - `otp` (string)
- Response yang dibutuhkan FE:
  - `success: true` jika OTP valid.
- Alur:
  - Setelah valid, FE akan redirect ke `/set_new_pass?email=...&otp=...`.

### 1.5 POST `/shelter/change`
- Body:
  - `email` (string)
  - `password` (string)
  - `repassword` (string)
- Response yang dibutuhkan FE:
  - `success: true` jika password berhasil diubah.
- Catatan:
  - FE tidak mengirim token dalam alur reset, jadi BE harus mengaitkan permintaan ini dengan OTP/verify sebelumnya atau email yang valid.

## 2. Shelter profile / data shelter

### 2.1 GET `/shelter/view/:id`
- Parameter path:
  - `id` = `user.id`
- Response yang dibutuhkan FE:
  - `statusCode: 200`
  - `details` berisi objek response asli dari backend
- FE memproses data seperti ini:
  - `data?.statusCode === 200 && data?.details?.code === 200`
  - `return data.details.data`
- Backend harus mengembalikan `details.data` sebagai objek shelter yang dapat ditampilkan oleh FE.

### 2.2 POST `/shelter/create/:id`
- Parameter path:
  - `id` = `user.id`
- Body:
  - `namaShelter` (string)
  - `namaOwner` (string)
  - `email` (string)
  - `nomorHandphone` (string)
  - `metodePembayaran` (string)
  - `negara` (string)
  - `jalan` (string)
  - `zipCode` (string)
- Response yang dibutuhkan FE:
  - `statusCode: 201`
  - `details` berisi response backend
- Catatan:
  - FE saat ini memaksa upload foto shelter di UI, tetapi payload belum mengirim file ke backend.
  - Jika backend ingin menyimpan foto shelter, harus ditambahkan dukungan `multipart/form-data` atau endpoint upload terpisah.

## 3. Perilaku dan kompatibilitas

- FE belum menunggu endpoint profile update; implementasi `/shelter/view/:id` dan `/shelter/create/:id` harus jadi prioritas.
- Response format REST FE sekarang diharapkan terdiri dari properti `success` dan `data`, serta `details` oleh wrapper action FE.
- Pastikan backend tidak memaksa perubahan path menjadi `/shelter/auth/*`, karena FE sudah menggunakan `/shelter/*`.

## 4. Item opsional / disarankan

### 4.1 Endpoint update shelter
- FE `profile_shelter/page.jsx` masih belum terhubung ke API.
- Disarankan menyediakan endpoint seperti:
  - `PUT /shelter/update/:id`
  - atau `POST /shelter/edit/:id`
- Body minimal sama dengan field shelter yang sudah ada.

### 4.2 Dukungan upload foto shelter
- FE sudah punya UI upload di halaman `buat_shelter`.
- Jika backend ingin menyimpan foto, endpoint harus menerima file image.
- Opsi:
  - `multipart/form-data` pada `/shelter/create/:id`
  - atau endpoint terpisah seperti `POST /shelter/upload-photo/:id`.

### 4.3 Konsistensi field `role`
- Jika backend mengharuskan field `role` pada register, gunakan default `user`.
- Namun FE saat ini sudah mengirim `role: "user"`, jadi backend bisa memanfaatkan itu.

## 5. Pesan singkat untuk tim BE

- Sesuaikan semua route FE berikut:
  - `POST /shelter/login`
  - `POST /shelter/register`
  - `POST /shelter/forgot`
  - `POST /shelter/verify`
  - `POST /shelter/change`
  - `GET /shelter/view/:id`
  - `POST /shelter/create/:id`
- Pastikan `login` mengembalikan `id` user.
- Pastikan `create shelter` mengembalikan `statusCode: 201`.
- Pastikan `view shelter` membungkus response ke dalam `details.data` dan `statusCode: 200`.
- Jangan ubah path FE tanpa koordinasi karena frontend sudah dikodekan untuk endpoint tersebut.

---

Dokumen ini dibuat berdasarkan kode frontend saat ini di `src/actions/auth.action.js`, `src/actions/shelter.action.js`, `src/app/(auth)/register/components/form_register.jsx`, dan `src/app/(beranda)/home/buat_shelter/page.jsx`.
