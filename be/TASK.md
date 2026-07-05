# Project Overview

Membangun aplikasi web RPAM (Rencana Pengamanan Air Minum) berbasis React dan Express untuk membantu instansi mengelola proses identifikasi bahaya, penilaian risiko, kaji ulang risiko, rencana perbaikan, dan pemantauan operasional.

Sistem digunakan oleh dua role:

- Admin
- User

Target pengguna maksimal sekitar 20 user aktif, sehingga tidak diperlukan arsitektur kompleks seperti microservice atau Redis — cukup layered architecture.

contoh

```
src
┣authentikasi
 ┣ authentikasi.controller.js
 ┣ authentikasi.repository.js
 ┣ authentikasi.route.js
 ┗ authentikasi.validator.js
```

# Objective

Aplikasi harus mampu
- Mengelola data RPAM
- Mengelola user
- Menghasilkan audit log
- Import Excel
- Export Excel
- Menghitung skor risiko otomatis
- Menghasilkan kode risiko otomatis
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
```
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
```

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

## Authentication
Login menggunakan:
- username
- password

Response:
- JWT Token

Logout hanya menghapus token pada client.

## User Management
Admin dapat:
- Create User
- Update User
- Delete User
- Activate User
- Deactivate User
- Change Role

## Audit Log

Sistem wajib mencatat: Login, Logout, Create, Update, Delete.

Audit log minimal menyimpan:
- User
- Timestamp
- Action
- Module
- Old Value (optional)
- New Value (optional)

**Delete policy:** semua modul data RPAM pakai **soft delete** (`deletedAt` timestamp), bukan hard delete — supaya `Old Value` tetap bisa direkam di audit log setelah data "dihapus". Query list/read wajib exclude record dengan `deletedAt != null`.

# Modul RPAM

## M1 Identifikasi Bahaya
CRUD.

Field yang diinput user:
- kode lokasi (relasi ke Lokasi SPAM)
- komponen SPAM
- kontaminasi (X)
- komponen SPAM (Y)
- penyebab (Z)
- kejadian bahaya (XYZ)
- tipe bahaya

**Kode risiko TIDAK diinput manual** — di-generate otomatis oleh backend. Lihat bagian "Kode Risiko — Auto Generate" di bawah.

## Kode Risiko — Auto Generate

- Format: `{PREFIX}{nomor 4 digit}`, contoh `K0001`, `F0002`, `M0001`.
- `PREFIX` diambil dari huruf pertama `tipeBahaya` (Fisika → F, Kimia → K, Mikrobiologi → M).
- Nomor urut naik terpisah per prefix — `K0001` → `K0002` tidak terganggu oleh berapa banyak data `F` atau `M` yang sudah dibuat duluan.
- Wajib unik (`@unique` di schema).
- **Cara hitung nomor berikutnya (asumsi, konfirmasi ke stakeholder kalau skala user bertambah jauh di atas 20):** query `kodeRisiko` terbesar dengan prefix yang sama (`ORDER BY kodeRisiko DESC LIMIT 1` via Prisma `findFirst`), lalu +1. Bungkus create dalam Prisma transaction (`$transaction`) supaya nomor tidak dobel kalau ada dua request nyaris bersamaan. Tidak perlu tabel counter terpisah di skala ~20 user ini.
- Endpoint create M1 tidak boleh menerima `kodeRisiko` dari body request — kalau dikirim, abaikan atau tolak dengan validasi Joi.

## M2 Penilaian Risiko
Field yang diinput user:
- identifikasi bahaya (relasi, dropdown dari M1)
- peluang
- dampak

Dihitung otomatis (lewat helper function, tidak boleh manual):
- skor = peluang × dampak
- tingkat risiko, berdasarkan skor:

| Score | Level         |
| ----- | ------------- |
| 1-5   | Rendah        |
| 6-10  | Medium        |
| 11-15 | Tinggi        |
| 16-20 | Sangat Tinggi |
| 21-25 | Ekstrem       |

## M4 Kaji Ulang Risiko
Field yang diinput user:
- penilaian risiko (relasi, dropdown dari M2)
- tindakan pengendalian
- referensi
- validasi (efektif / tidak efektif / tidak pasti)
- peluang setelah pengendalian
- dampak setelah pengendalian

Dihitung otomatis (helper function yang sama dengan M2):
- skor setelah pengendalian = peluang setelah × dampak setelah
- tingkat risiko setelah pengendalian (tabel sama seperti M2)

## M5 Rencana Perbaikan
CRUD. Field:
- kaji ulang risiko (relasi, dropdown dari M4)
- rencana perbaikan
- penanggung jawab (PIC)
- jadwal pelaksanaan
- biaya
- sumber pembiayaan
- status kemajuan
- kendala (keuangan / tenaga kerja)
- prioritas (jangka pendek / menengah / panjang)

## M6.2 Pemantauan Operasional
CRUD. Field:
- rencana perbaikan (relasi, dropdown dari M5 — via kaji ulang risiko)
- batas kritis
- apa yang dipantau
- dimana
- kapan
- bagaimana
- pelaksana
- analis
- penerima laporan
- tindakan koreksi
- pelaksana koreksi
- waktu koreksi
- penerima laporan tindakan koreksi

Tidak ada skor otomatis di modul ini — skor risiko sudah selesai dihitung di M2/M4.

## Alur pengisian data (berjenjang, tidak semua baris harus sampai M6.2)

```
M1 Identifikasi Bahaya   → SEMUA baris wajib ada di sini
        ↓
M2 Penilaian Risiko      → SEMUA bahaya idealnya dinilai (biar tahu levelnya)
        ↓ (kalau tingkat risiko rendah, BISA BERHENTI DI SINI)
M4 Kaji Ulang Risiko     → hanya untuk risiko yang perlu pengendalian
        ↓ (kalau sudah efektif dikendalikan, BISA BERHENTI DI SINI)
M5 Rencana Perbaikan     → hanya untuk risiko yang M4-nya belum efektif/butuh tindak lanjut
        ↓
M6.2 Pemantauan Operasional → hanya untuk risiko yang sudah ada kontrol/rencana yang perlu dipantau rutin
```

Kalau develop langsung ke modul akhir (mis. M6.2) tanpa data modul sebelumnya, buat data dummy/seed dulu untuk modul-modul di atasnya.

## Semua modul CRUD
Wajib mendukung: search, filter, sort, pagination (infinite scroll).

## Import Excel
- Pakai Multer.
- Validasi: extension `.xlsx`, template sesuai, field wajib terisi.
- Gagal → `400 Bad Request` dengan detail error.
- `kodeRisiko` tidak boleh jadi kolom wajib di template import M1 — tetap di-generate backend saat proses import, bukan dibaca dari file.

## Export Excel
- Semua modul bisa diekspor.
- Export keseluruhan → satu file, banyak sheet (satu sheet per modul).

## Dashboard
Menampilkan:
- jumlah user
- aktivitas terbaru
- total data RPAM
- distribusi tingkat risiko

# API Convention

REST API. Contoh:
```
GET /users
POST /users
PUT /users/:id
DELETE /users/:id
```

Response sesuai `/src/utils/response.js`:
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

# Validation Rules
Semua request wajib divalidasi menggunakan Joi. Tidak boleh menggunakan validasi manual.

# Security
- Password menggunakan bcrypt.
- JWT expiration 24 jam.
- Semua endpoint selain login wajib middleware authentication.
- Role menggunakan middleware authorization.

# Definition of Done
Feature dianggap selesai apabila:
- CRUD berjalan
- Validasi berjalan
- Authorization berjalan
- Audit Log tercatat
- Unit Test lulus
- ESLint tanpa error
- Build berhasil
- Tidak ada console error

# AI Instructions

Saat menghasilkan kode, AI wajib mengikuti aturan berikut:
- Jangan mengubah struktur folder tanpa instruksi.
- Jangan menghapus kode yang sudah ada.
- Jangan membuat library baru jika fungsi dapat diselesaikan dengan library yang telah dipilih.
- Semua endpoint harus menggunakan Prisma ORM, tidak menggunakan query SQL mentah kecuali benar-benar diperlukan.
- Seluruh validasi request menggunakan Joi.
- Semua endpoint yang memerlukan autentikasi harus menggunakan JWT middleware.
- Terapkan Role-Based Access Control (RBAC) untuk membedakan hak akses Admin dan User.
- Semua operasi Create, Update, dan Delete wajib mencatat Audit Log (dengan Old Value/New Value).
- Delete selalu soft delete (`deletedAt`), tidak pernah hard delete pada data RPAM.
- `kodeRisiko` pada M1 selalu di-generate backend, tidak pernah menerima nilai dari client.
- Jika requirement tidak jelas, tuliskan asumsi dalam komentar atau dokumentasi, jangan mengarang perilaku sistem.
- Pastikan semua kode lolos ESLint dan tidak menghasilkan warning baru.
- Sebelum membuat file baru, periksa apakah file serupa sudah ada dan gunakan kembali jika memungkinkan.