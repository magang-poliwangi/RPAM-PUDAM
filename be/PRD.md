# Project Overview

Membangun aplikasi web RPAM (Rencana Pengamanan Air Minum) berbasis React dan Express untuk membantu instansi mengelola proses identifikasi bahaya, penilaian risiko, kaji ulang risiko, rencana perbaikan, dan pemantauan operasional.

Sistem digunakan oleh dua role:

- Admin
- User

Target pengguna maksimal sekitar 20 user aktif, sehingga tidak diperlukan arsitektur kompleks seperti microservice atau Redis cukup layered arsitektur.
contoh 

src
┣authentikasi
 ┣ authentikasi.controller.js
 ┣ authentikasi.repository.js
 ┣ authentikasi.route.js
 ┗ authentikasi.validator.js


# Objective

Aplikasi harus mampu
- Mengelola data RPAM
- Mengelola user
- Menghasilkan audit log
- Import Excel
- Export Excel
- Menghitung skor risiko otomatis
- Monitoring aktivitas pengguna

# Tech Stack
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Joi
- Multer
- JWT
- NanoID
- bcrypt
- CORS
- Nodemon
- ESLint


# Struktur Project
be
 ┣ src
 ┃ ┣ databases
 ┃ ┃ ┣ generated
 ┃ ┃ ┃ ┗ prisma
 ┃ ┃ ┃ ┃ ┣ internal
 ┃ ┃ ┃ ┃ ┃ ┣ class.ts
 ┃ ┃ ┃ ┃ ┃ ┣ prismaNamespace.ts
 ┃ ┃ ┃ ┃ ┃ ┗ prismaNamespaceBrowser.ts
 ┃ ┃ ┃ ┃ ┣ models
 ┃ ┃ ┃ ┃ ┣ browser.ts
 ┃ ┃ ┃ ┃ ┣ client.ts
 ┃ ┃ ┃ ┃ ┣ commonInputTypes.ts
 ┃ ┃ ┃ ┃ ┣ enums.ts
 ┃ ┃ ┃ ┃ ┗ models.ts
 ┃ ┃ ┣ prisma
 ┃ ┃ ┃ ┣ migrations
 ┃ ┃ ┃ ┃ ┣ 20260703105902_first_init
 ┃ ┃ ┃ ┃ ┃ ┗ migration.sql
 ┃ ┃ ┃ ┃ ┗ migration_lock.toml
 ┃ ┃ ┃ ┗ schema.prisma
 ┃ ┃ ┣ client.js
 ┃ ┃ ┗ prisma.config.ts
 ┃ ┣ exceptions
 ┃ ┃ ┣ client-error.js
 ┃ ┃ ┗ error.js
 ┃ ┣ middlewares
 ┃ ┃ ┣ authenticate-token.js
 ┃ ┃ ┣ error-handling.js
 ┃ ┃ ┗ validate.js
 ┃ ┣ security
 ┃ ┃ ┗ token-manager.js
 ┃ ┣ services
 ┃ ┣ test
 ┃ ┣ utils
 ┃ ┃ ┗ response.js
 ┃ ┣ container.js
 ┃ ┣ env.js
 ┃ ┣ routes.js
 ┃ ┗ server.js
 ┣ .env
 ┣ .env.example
 ┣ .gitignore
 ┣ eslint.config.js
 ┣ package-lock.json
 ┣ package.json
 ┣ README.md


# User Roles
## Admin

Hak akses:

- CRUD User
- CRUD seluruh data RPAM
- Import Excel
- Export Excel
- Melihat Audit Log
- Monitoring aktivitas

## User
Hak akses:
- Login
- CRUD data RPAM
- Export Excel
- Import Excel
- Search
- Filter
Tidak dapat:
- Mengelola User
- Melihat Audit Log


# Functional Requirements
Authentication
Login
User login menggunakan:
- username
- password

Response:
- JWT Token
- Logout hanya menghapus token pada client.



# User Management
Admin dapat:

- Create User
- Update User
- Delete User
- Activate User
- Deactivate User
- Change Role


Audit Log

Sistem wajib mencatat:

Login
Logout
Create
Update
Delete

# Audit log minimal menyimpan:
- User
- Timestamp
- Action
- Module
- Old Value (optional)
- New Value (optional)


# Modul RPAM
M1 Identifikasi Bahaya
CRUD
Field:
- kode lokasi
- kode risiko
- komponen SPAM
- kontaminasi
- penyebab
- kejadian bahaya
- tipe bahaya

# M2 Penilaian Risiko
Field:
- peluang
- dampak

Automatic:
`` score = peluang × dampak``
Risk Level

| Score | Level         |
| ----- | ------------- |
| 1-5   | Rendah        |
| 6-10  | Medium        |
| 11-15 | Tinggi        |
| 16-20 | Sangat Tinggi |
| 21-25 | Ekstrem       |


AI tidak boleh menghitung manual, selalu menggunakan helper function.

# M4 Kaji Ulang

Field:

- tindakan
- referensi
- validasi
- efektivitas
- peluang baru
- dampak baru

# M5 Rencana Perbaikan
CRUD
Field:
- rencana
- PIC
- biaya
- sumber dana
- prioritas
- status

# M6 Pemantauan

CRUD

Field:

- batas kritis
- apa
- dimana
- kapan
- bagaimana
- pelaksana
- analis
- tindakan koreksi
Score dihitung otomatis.


# Search

Semua tabel harus memiliki:

- Search
- Filter
- Sort
- Pagination


Import Excel

Import menggunakan Multer.

# Validasi:

- extension xlsx
- template sesuai
- field wajib
Jika gagal:
400 Bad Request
dengan detail error.

# Export Excel
Semua modul dapat diekspor.
Export keseluruhan menghasilkan beberapa sheet.


Dashboard

Dashboard menampilkan:

- jumlah user
- aktivitas terbaru
- total data RPAM
- distribusi tingkat risiko

# API Convention

REST API.

Contoh:
GET /users

POST /users

PUT /users/:id

DELETE /users/:id
Response sesuai dengan /src/utils/response.js
{
  success,
  message,
  data
}



# Validation Rules

Semua request wajib divalidasi menggunakan Joi.

Tidak boleh menggunakan validasi manual.



# Security
Password menggunakan bcrypt.
JWT expiration
24 ja
Semua endpoint selain login wajib middleware authentication.
Role menggunakan middleware authorization.



# Definition of Done

Feature dianggap selesai apabila:

CRUD berjalan
Validasi berjalan
Authorization berjalan
Audit Log tercatat
Unit Test lulus
ESLint tanpa error
Build berhasil
Tidak ada console error


# AI Instructions

Saat menghasilkan kode, AI wajib mengikuti aturan berikut:

- Jangan mengubah struktur folder tanpa instruksi.
- Jangan menghapus kode yang sudah ada.
- Jangan membuat library baru jika fungsi dapat diselesaikan dengan library yang telah dipilih.
- Semua endpoint harus menggunakan Prisma ORM, tidak menggunakan query SQL mentah kecuali benar-benar diperlukan.
- Seluruh validasi request menggunakan Joi.
- Semua endpoint yang memerlukan autentikasi harus menggunakan JWT middleware.
- Terapkan Role-Based Access Control (RBAC) untuk membedakan hak akses Admin dan User.
- Semua operasi Create, Update, dan Delete wajib mencatat Audit Log.
- Jika requirement tidak jelas, tuliskan asumsi dalam komentar atau dokumentasi, jangan mengarang perilaku sistem.
- Pastikan semua kode lolos ESLint dan tidak menghasilkan warning baru.
- Sebelum membuat file baru, periksa apakah file serupa sudah ada dan gunakan kembali jika memungkinkan.