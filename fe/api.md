# API Contract — RPAM Backend

| | |
|---|---|
| Versi | 1.0 |
| Tanggal | 03 Juli 2026 |
| Base URL | `https://<host>/api` (asumsi prefix `/api`, sesuaikan dengan `routes.js`) |
| Auth | `Authorization: Bearer <JWT>` di semua endpoint kecuali `POST /auth/login` |
| Response envelope | `{ success, message, data }` — sesuai `src/utils/response.js` |

Dokumen ini adalah kontrak API antara FE dan BE, diturunkan dari FR-01–FR-35, NFR terkait, dan `rpam-backend` / `rpam-frontend` skill. Setiap asumsi struktural (relasi antar modul, nama field yang tidak eksplisit di FR) ditandai jelas — **wajib dikonfirmasi sebelum implementasi final**, tapi cukup lengkap untuk mulai coding sesuai instruksi "kalau requirement tidak jelas, tulis asumsi jangan mengarang perilaku".

---

## 1. Konvensi Umum

### 1.1 Response envelope

Sukses:
```json
{ "success": true, "message": "string", "data": { } }
```

Gagal:
```json
{ "success": false, "message": "string", "data": { "errors": [ { "field": "peluang", "message": "peluang wajib diisi" } ] } }
```
`data.errors` hanya muncul untuk `400` (validation error dari Joi). Untuk error lain (`401`, `403`, `404`, `409`, `500`), `data` bernilai `null`.

### 1.2 Pagination & list query params

Semua endpoint `GET` list mendukung query params berikut (konsisten di semua modul):

| Param | Tipe | Default | Keterangan |
|---|---|---|---|
| `page` | int | `1` | Halaman ke-berapa |
| `pageSize` | int | `10` | Jumlah item per halaman (asumsi default, lihat `rpam-backend` skill §5) |
| `search` | string | — | Keyword search (field yang di-search berbeda per modul, lihat masing-masing) |
| `sortBy` | string | `createdAt` | Nama kolom untuk sort |
| `sortOrder` | `asc` \| `desc` | `desc` | Arah sort |

Response list:
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "items": [ ],
    "pagination": { "page": 1, "pageSize": 10, "total": 42, "totalPages": 5 }
  }
}
```

### 1.3 ID & Timestamps

- Semua ID entitas: string NanoID (bukan auto-increment integer) — sesuai NFR-08.
- Timestamp (`createdAt`, `updatedAt`, `deletedAt`) format ISO 8601 UTC.
- Soft delete: record yang dihapus punya `deletedAt` terisi, tidak muncul di endpoint `GET` list/detail biasa (lihat `rpam-backend` skill §6).

### 1.4 HTTP status code standar

| Kode | Kapan dipakai |
|---|---|
| `200` | GET/PUT/PATCH sukses |
| `201` | POST (create) sukses |
| `400` | Validasi Joi gagal, format file salah, dsb. |
| `401` | Token tidak ada / invalid / expired |
| `403` | Token valid tapi role tidak punya akses (RBAC) |
| `404` | Resource tidak ditemukan |
| `409` | Konflik (mis. username sudah dipakai) |
| `500` | Server error |

### 1.5 Role notation

`Admin` / `User` / `Admin, User` (keduanya boleh akses) — sesuai matrix RBAC di `rpam-backend` skill §3.

---

## 2. Autentikasi

| Method | Path | Role | Deskripsi |
|---|---|---|---|
| `POST` | `/auth/login` | Public | Login, tidak perlu token |
| `GET` | `/auth/me` | Admin, User | Ambil profil user yang sedang login (dari token) |

**`POST /auth/login`**
Request:
```json
{ "username": "string", "password": "string" }
```
Response `200`:
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "jwt-string",
    "user": { "id": "string", "username": "string", "role": "Admin | User", "isActive": true }
  }
}
```
Error `401`: pesan **persis** *"Username atau Password salah"* (password salah) atau *"Akun tidak ditemukan"* (username tidak ada) — sesuai copy text di FR/Test Plan.
Error `403`: akun dinonaktifkan → *"Akun tidak aktif, hubungi Admin"*.

> **Catatan:** Tidak ada endpoint `POST /auth/logout` di server — sesuai requirement "Logout hanya menghapus token pada client" (Project Overview §Auth). Kalau butuh audit log entry untuk logout, FE cukup panggil `POST /audit-logs/logout-event` (lihat §4) sebelum membuang token, karena tidak ada state sesi di server untuk di-invalidate.

---

## 3. Manajemen User (Admin only)

| Method | Path | Role | Deskripsi |
|---|---|---|---|
| `GET` | `/users` | Admin | List user (search/filter/sort/pagination) |
| `GET` | `/users/:id` | Admin | Detail user |
| `POST` | `/users` | Admin | Tambah user |
| `PUT` | `/users/:id` | Admin | Update data user |
| `DELETE` | `/users/:id` | Admin | Hapus user (soft delete) |
| `PATCH` | `/users/:id/role` | Admin | Ubah role |
| `PATCH` | `/users/:id/activate` | Admin | Aktifkan akun |
| `PATCH` | `/users/:id/deactivate` | Admin | Nonaktifkan akun |

`GET /users` — search by `username`.

`POST /users` request:
```json
{ "username": "string", "password": "string", "role": "Admin | User" }
```
Response `201`, data user (tanpa `password`). Error `409` kalau username sudah dipakai — pesan **persis** *"Username telah digunakan"*.

`PUT /users/:id` request: `{ "username": "string" }` (password reset dianggap fitur terpisah, tidak ada di FR — **asumsi: belum diimplementasi**, konfirmasi ke stakeholder kalau dibutuhkan).

`PATCH /users/:id/role` request: `{ "role": "Admin | User" }`

`PATCH /users/:id/activate` & `/deactivate`: tanpa body. Response data: `{ "id", "isActive": true|false }`.

---

## 4. Audit Log (Admin only)

| Method | Path | Role | Deskripsi |
|---|---|---|---|
| `GET` | `/audit-logs` | Admin | List audit log (filter tanggal & user) |
| `POST` | `/audit-logs/logout-event` | Admin, User | Catat event logout (dipanggil FE sebelum buang token, lihat §2) |

`GET /audit-logs` query params tambahan (di luar §1.2):

| Param | Tipe | Keterangan |
|---|---|---|
| `userId` | string | Filter by user |
| `dateFrom` | ISO date | Filter tanggal mulai |
| `dateTo` | ISO date | Filter tanggal akhir |
| `action` | `LOGIN`\|`LOGOUT`\|`CREATE`\|`UPDATE`\|`DELETE` | Filter jenis aksi |
| `module` | string | Filter modul, mis. `identifikasi-bahaya` |

Response item shape:
```json
{
  "id": "string",
  "user": { "id": "string", "username": "string" },
  "timestamp": "2026-07-03T10:00:00Z",
  "action": "CREATE",
  "module": "identifikasi-bahaya",
  "oldValue": null,
  "newValue": { }
}
```

---

## 5. Modul Data RPAM

Semua modul di bawah punya **pola endpoint CRUD yang sama** (Admin & User boleh akses, sesuai RBAC matrix):

```
GET    /<module>              list (search/filter/sort/pagination)
GET    /<module>/:id          detail
POST   /<module>               create
PUT    /<module>/:id          update
DELETE /<module>/:id          delete (soft delete)
```

Field spesifik & filter tambahan per modul ada di bawah. **Setiap create/update/delete otomatis mencatat audit log** — tidak perlu endpoint terpisah dari FE untuk itu.

### 5.1 M1 — Identifikasi Bahaya (`/identifikasi-bahaya`)

Search by: `kodeLokasi`, `kodeRisiko`. Filter tambahan: `tipeBahaya`, `lokasi` (FR-24, FR-26).

Request body (create/update):
```json
{
  "kodeLokasi": "string",
  "kodeRisiko": "string",
  "komponenSpam": "string",
  "kontaminasi": "string",
  "penyebab": "string",
  "kejadianBahaya": "string",
  "tipeBahaya": "string"
}
```

### 5.2 M2 — Penilaian Risiko (`/penilaian-risiko`)

> **Asumsi relasi:** setiap Penilaian Risiko mengacu ke satu record Identifikasi Bahaya (`identifikasiBahayaId`), relasi 1-ke-1. Ini asumsi karena FR-18 (Tabel 3.1) dan FR-19 (Tabel 3.5) didefinisikan sebagai tabel terpisah tanpa relasi eksplisit — perlu dikonfirmasi ke product owner.

Filter tambahan: `tingkatRisiko` (FR-25).

Request body (create/update):
```json
{
  "identifikasiBahayaId": "string",
  "peluang": 3,
  "dampak": 4
}
```
Response data — `skorRisiko` & `tingkatRisiko` **read-only, dihitung backend** via helper function (`rpam-backend` skill §5), jangan dikirim dari FE:
```json
{
  "id": "string",
  "identifikasiBahayaId": "string",
  "peluang": 3,
  "dampak": 4,
  "skorRisiko": 12,
  "tingkatRisiko": "Tinggi",
  "warnaTingkatRisiko": "oranye"
}
```

### 5.3 M4 — Kaji Ulang Risiko (`/kaji-ulang`)

> **Asumsi relasi:** setiap Kaji Ulang mengacu ke satu Penilaian Risiko (`penilaianRisikoId`) yang sedang di-review.

Request body:
```json
{
  "penilaianRisikoId": "string",
  "tindakan": "string",
  "referensi": "string",
  "validasi": "efektif | tidak_efektif | tidak_pasti",
  "peluangBaru": 2,
  "dampakBaru": 3
}
```
Response — `skorRisikoBaru` & `tingkatRisikoBaru` read-only, dihitung ulang lewat helper function yang sama dengan M2.

### 5.4 M5 — Rencana Perbaikan (`/rencana-perbaikan`)

> **Asumsi relasi:** mengacu ke satu Kaji Ulang (`kajiUlangId`) — rencana perbaikan adalah tindak lanjut dari hasil kaji ulang.

Request body:
```json
{
  "kajiUlangId": "string",
  "rencana": "string",
  "pic": "string",
  "jadwal": "2026-08-01",
  "biaya": 5000000,
  "sumberDana": "string",
  "statusKemajuan": "belum_mulai | berjalan | selesai | tertunda",
  "kendala": "string",
  "prioritas": "rendah | sedang | tinggi",
  "tingkatRisikoDenganPengendalian": "Rendah | Medium | Tinggi | Sangat Tinggi | Ekstrem"
}
```
> **Catatan konflik requirement:** FR-21 cuma menyebut 4 opsi (Rendah/Medium/Sangat Tinggi/Ekstrem) untuk `tingkatRisikoDenganPengendalian`, melewati "Tinggi" — sama seperti konflik di M2 (`rpam-backend` skill §5). Kontrak ini pakai 5 opsi supaya konsisten dengan skala risiko utama; konfirmasi ke stakeholder.

### 5.5 M6 — Pemantauan Operasional (`/pemantauan`)

> **Asumsi relasi:** field opsional `rencanaPerbaikanId` (nullable) kalau pemantauan ini terkait rencana perbaikan tertentu; boleh berdiri sendiri.
> **Catatan konflik requirement:** Project Overview bilang "Score dihitung otomatis" untuk M6, tapi FR-22 tidak menyediakan field `peluang`/`dampak` untuk dihitung. Kontrak ini **tidak menyertakan field skor** untuk M6 — kalau ternyata dibutuhkan, perlu klarifikasi field input skornya apa.

Request body:
```json
{
  "rencanaPerbaikanId": "string | null",
  "batasKritis": "string",
  "apa": "string",
  "dimana": "string",
  "kapan": "string",
  "bagaimana": "string",
  "pelaksana": "string",
  "analis": "string",
  "penerimaLaporan": "string",
  "tindakanKoreksi": "string",
  "pelaksanaKoreksi": "string",
  "waktuKoreksi": "2026-08-01T00:00:00Z"
}
```

---

## 6. Import Excel

| Method | Path | Role | Deskripsi |
|---|---|---|---|
| `POST` | `/import/:module` | Admin, User | Upload file `.xlsx` untuk modul tertentu |

`:module` ∈ `identifikasi-bahaya`, `penilaian-risiko`, `kaji-ulang`, `rencana-perbaikan`, `pemantauan`, `users` (Admin only untuk `users`).

Request: `multipart/form-data`, field `file`.

Response `200` (sukses, termasuk sebagian gagal):
```json
{
  "success": true,
  "message": "Import selesai",
  "data": {
    "totalRows": 50,
    "successCount": 48,
    "failedCount": 2,
    "failedRows": [
      { "row": 12, "errors": ["kodeLokasi wajib diisi"] },
      { "row": 30, "errors": ["tipeBahaya tidak valid"] }
    ]
  }
}
```
Response `400` (format file salah / bukan `.xlsx` / template tidak sesuai): `message` berisi detail error, `data: null`.

> **Asumsi (belum ditentukan requirement):** data duplikat saat import — kontrak ini **skip baris duplikat** dan laporkan di `failedRows` dengan pesan `"Data duplikat, dilewati"`, bukan overwrite otomatis. Perlu dikonfirmasi ke stakeholder (TC-53 di Test Plan menyebut perilaku ini "sesuai aturan yang diterapkan" tanpa detail).

---

## 7. Export Excel

| Method | Path | Role | Deskripsi |
|---|---|---|---|
| `GET` | `/export/:module` | Admin, User | Export satu modul → 1 file, 1 sheet |
| `GET` | `/export/all` | Admin, User | Export semua modul → 1 file, multi-sheet |

Query params: sama seperti filter list (§1.2 + filter modul) supaya bisa export hasil filter, bukan cuma semua data.

Response: `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, file `.xlsx` langsung sebagai binary body (bukan dibungkus response envelope JSON).

---

## 8. Dashboard

| Method | Path | Role | Deskripsi |
|---|---|---|---|
| `GET` | `/dashboard` | Admin, User | Ringkasan dashboard |

Response data:
```json
{
  "jumlahUserAktif": 15,
  "totalDataRpam": { "identifikasiBahaya": 40, "penilaianRisiko": 40, "kajiUlang": 12, "rencanaPerbaikan": 8, "pemantauan": 20 },
  "distribusiTingkatRisiko": { "Rendah": 10, "Medium": 15, "Tinggi": 8, "SangatTinggi": 5, "Ekstrem": 2 },
  "aktivitasTerbaru": [
    { "user": "string", "action": "CREATE", "module": "identifikasi-bahaya", "timestamp": "2026-07-03T10:00:00Z" }
  ]
}
```
> `jumlahUserAktif` hanya relevan/terlihat penuh untuk Admin (FR-35); User tetap bisa hit endpoint yang sama tapi FE boleh sembunyikan widget ini untuk role User sesuai RBAC §7 dashboard (`rpam-frontend` skill §7).

---

## 9. Ringkasan Asumsi Struktural (perlu konfirmasi)

| # | Asumsi | Alasan |
|---|---|---|
| 1 | M2 relasi 1-ke-1 ke M1 via `identifikasiBahayaId` | FR-18/FR-19 dua tabel terpisah tanpa relasi eksplisit |
| 2 | M4 relasi ke M2 via `penilaianRisikoId` | "Kaji ulang" secara logis me-review satu penilaian risiko |
| 3 | M5 relasi ke M4 via `kajiUlangId` | "Rencana perbaikan" tindak lanjut dari hasil kaji ulang |
| 4 | M6 relasi opsional ke M5 via `rencanaPerbaikanId` (nullable) | Tidak ada relasi eksplisit di FR, dibuat opsional supaya tidak memaksa |
| 5 | M6 tidak punya field skor | FR-22 tidak sediakan `peluang`/`dampak`, kontradiksi dengan Project Overview |
| 6 | `tingkatRisikoDenganPengendalian` M5 pakai 5 opsi (termasuk "Tinggi") | Konsisten dengan skala 5-tingkat di M2/M4, walau FR-21 cuma sebut 4 |
| 7 | Import data duplikat: skip + laporkan, bukan overwrite | TC-53 tidak spesifik |
| 8 | Reset password user belum ada endpoint | Tidak disebut di FR-06–FR-10 |
| 9 | Tidak ada endpoint `logout` server-side (kecuali audit trail) | Sesuai "logout hanya hapus token client" |
| 10 | Default `pageSize` = 10 | Tidak ditentukan requirement |

---

## 10. Referensi

- `rpam-backend` skill — implementasi detail, RBAC middleware, audit log service, risk-score helper, integration testing.
- `rpam-frontend` skill — cara FE konsumsi endpoint ini (Axios convention, unwrap `data`, Redux slice shape).
- `PRD-RPAM-Frontend.md` — requirement level produk untuk FE.
- Dokumen asli: Project Overview, FR-01–FR-35, NFR-01–NFR-37, Test Plan TS-01–TS-15.