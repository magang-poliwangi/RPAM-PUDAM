# API Contract — RPAM Backend

| | |
|---|---|
| Versi | 1.1 |
| Tanggal | 05 Juli 2026 |
| Base URL | `https://<host>/api` (asumsi prefix `/api`, sesuaikan dengan `routes.js`) |
| Auth | `Authorization: Bearer <JWT>` di semua endpoint kecuali `POST /auth/login` |
| Response envelope | `{ success, message, data }` — sesuai `src/utils/response.js` |

Dokumen ini adalah kontrak API antara FE dan BE, diturunkan dari FR-01–FR-35, NFR terkait, `schema.prisma` final, dan `rpam-backend` / `rpam-frontend` skill. Field request/response di bawah **mengikuti nama field persis seperti di schema.prisma** — bukan nama generik/ringkas — supaya tidak ada layer translasi tersembunyi yang bisa salah.

---

## 1. Konvensi Umum

### 1.1 Response envelope

Sukses:
```json
{ "success": true, "message": "string", "data": { } }
```

Gagal:
```json
{ "success": false, "message": "string", "data": { "errors": [ { "field": "peluangKejadianBahaya", "message": "peluang wajib diisi" } ] } }
```
`data.errors` hanya muncul untuk `400` (validation error dari Joi). Untuk error lain (`401`, `403`, `404`, `409`, `500`), `data` bernilai `null`.

### 1.2 List query params

Semua endpoint `GET` list mendukung query params berikut (konsisten di semua modul):

| Param | Tipe | Default | Keterangan |
|---|---|---|---|
| `page` | int | `1` | Halaman ke-berapa (dipakai backend sebagai offset, FE menyebutnya "batch") |
| `pageSize` | int | `10` | Jumlah item per batch (lihat `rpam-frontend` PRD §9 gap #7) |
| `search` | string | — | Keyword search (field yang di-search berbeda per modul, lihat masing-masing) |
| `sortBy` | string | `createdAt` | Nama kolom untuk sort |
| `sortOrder` | `asc` \| `desc` | `desc` | Arah sort |

> **Catatan FE:** endpoint ini tetap page-based di level API (mekanisme paling sederhana buat backend). FE mengonsumsinya sebagai **infinite scroll**: increment `page` tiap fetch berikutnya, append hasil ke state (bukan replace) sampai `items.length >= total`. Tidak ada perubahan kontrak yang dibutuhkan untuk ini — murni pola konsumsi di FE (`rpam-frontend` skill §5).

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

- **Konflik dokumen (belum diputuskan, jangan pilih sepihak):** dokumen ini sebelumnya bilang ID pakai NanoID sesuai draft awal skill, tapi `schema.prisma` final yang sudah dikerjakan pakai `@default(cuid())` di semua model. Sampai ada keputusan resmi, **implementasi aktual = cuid**, bukan NanoID. Kalau memang mau NanoID, itu perlu perubahan schema.prisma dulu (ganti `@default(cuid())` jadi `@default(dbgenerated())` custom atau pakai `@id @default(nanoid())` via extension), bukan cuma dokumen ini.
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

### 1.5 Role & enum notation

Semua field enum di response/request **memakai value persis seperti di schema.prisma** (uppercase + underscore), bukan versi title-case/lowercase — supaya FE tidak perlu layer mapping tambahan:

- `Role`: `ADMIN` | `USER`
- `TingkatRisiko`: `RENDAH` | `MEDIUM` | `TINGGI` | `SANGAT_TINGGI` | `EKSTREM`
- `StatusValidasi`: `EFEKTIF` | `TIDAK_EFEKTIF` | `TIDAK_PASTI`
- `StatusKemajuan`: `BELUM_MULAI` | `SEDANG_BERJALAN` | `SELESAI` | `TERTUNDA`
- `PrioritasRencanaPerbaikan`: `PENDEK` | `MENENGAH` | `PANJANG`
- `AksiAuditLog`: `LOGIN` | `LOGOUT` | `CREATE` | `UPDATE` | `DELETE`

Role akses endpoint: `Admin` / `User` / `Admin, User` (keduanya boleh akses) — sesuai matrix RBAC di `rpam-backend` skill §3.

---

## 2. Autentikasi

| Method | Path | Role | Deskripsi |
|---|---|---|---|
| `POST` | `/auth` | Public | Login, tidak perlu token |
| `GET` | `/auth` | Admin, User | Ambil profil user yang sedang login (dari token) |

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
    "user": { "id": "string", "username": "string", "role": "ADMIN | USER", "isActive": true }
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
{ "username": "string", "password": "string", "role": "ADMIN | USER" }
```
Response `201`, data user (tanpa `password`). Error `409` kalau username sudah dipakai — pesan **persis** *"Username telah digunakan"*.

`PUT /users/:id` request: `{ "username": "string" }` (password reset dianggap fitur terpisah, tidak ada di FR — **asumsi: belum diimplementasi**, konfirmasi ke stakeholder kalau dibutuhkan).

`PATCH /users/:id/role` request: `{ "role": "ADMIN | USER" }`

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

Response item shape (mengikuti field `AuditLog` di schema.prisma — `aksi`, bukan `action`, `keterangan` opsional):
```json
{
  "id": "string",
  "user": { "id": "string", "username": "string" },
  "aksi": "CREATE",
  "module": "identifikasi-bahaya",
  "recordId": "string",
  "oldValue": null,
  "newValue": { },
  "keterangan": null,
  "createdAt": "2026-07-03T10:00:00Z"
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

Search by: `lokasiSpamId` (via nama/kode lokasi), `kodeRisiko`. Filter tambahan: `tipeBahaya`, `lokasiSpamId` (FR-24, FR-26).

Request body (create/update) — **`kodeRisiko` TIDAK ADA di body, backend generate otomatis (lihat `rpam-backend` skill §5a). Kalau field ini dikirim FE, backend abaikan.**
```json
{
  "lokasiSpamId": "string",
  "komponenSpam": "string",
  "kontaminasiX": "string",
  "komponenSpamY": "string",
  "penyebabZ": "string",
  "kejadianBahayaXYZ": "string",
  "tipeBahaya": "string"
}
```

Response (create/detail) — `kodeRisiko` muncul sebagai field read-only hasil generate:
```json
{
  "id": "string",
  "lokasiSpamId": "string",
  "kodeRisiko": "K0001",
  "komponenSpam": "string",
  "kontaminasiX": "string",
  "komponenSpamY": "string",
  "penyebabZ": "string",
  "kejadianBahayaXYZ": "string",
  "tipeBahaya": "string",
  "createdAt": "2026-07-03T10:00:00Z",
  "updatedAt": "2026-07-03T10:00:00Z"
}
```

### 5.2 M2 — Penilaian Risiko (`/penilaian-risiko`)

Relasi 1-ke-1 ke M1 via `identifikasiBahayaId` (`identifikasiBahayaId` unique di schema — **sudah final**, bukan lagi asumsi terbuka).

Filter tambahan: `tingkatRisiko` (FR-25).

Request body (create/update):
```json
{
  "identifikasiBahayaId": "string",
  "peluangKejadianBahaya": 3,
  "dampakKeparahan": 4
}
```
Response data — `skorRisiko` & `tingkatRisiko` **read-only, dihitung backend** via helper function (`rpam-backend` skill §5), jangan dikirim dari FE:
```json
{
  "id": "string",
  "identifikasiBahayaId": "string",
  "peluangKejadianBahaya": 3,
  "dampakKeparahan": 4,
  "skorRisiko": 12,
  "tingkatRisiko": "TINGGI",
  "warnaTingkatRisiko": "abu_abu"
}
```

### 5.3 M4 — Kaji Ulang Risiko (`/kaji-ulang`)

Relasi 1-ke-1 ke M2 via `penilaianRisikoId` (unique — final).

Request body:
```json
{
  "penilaianRisikoId": "string",
  "tindakanPengendalian": "string",
  "referensi": "string",
  "validasi": "EFEKTIF | TIDAK_EFEKTIF | TIDAK_PASTI",
  "peluangSetelah": 2,
  "dampakSetelah": 3
}
```
Response — `skorSetelah` & `tingkatRisikoSetelah` read-only, dihitung ulang lewat helper function yang sama dengan M2. Nama field sengaja beda dari M2 (pakai akhiran `Setelah`) supaya tidak ambigu di export Excel — lihat `rpam-backend` skill §5, M4.
```json
{
  "id": "string",
  "penilaianRisikoId": "string",
  "tindakanPengendalian": "string",
  "referensi": "string",
  "validasi": "EFEKTIF",
  "peluangSetelah": 2,
  "dampakSetelah": 3,
  "skorSetelah": 6,
  "tingkatRisikoSetelah": "MEDIUM"
}
```

### 5.4 M5 — Rencana Perbaikan (`/rencana-perbaikan`)

Relasi 1-ke-1 ke M4 via `kajiUlangRisikoId` (unique — final).

Request body:
```json
{
  "kajiUlangRisikoId": "string",
  "rencanaPerbaikan": "string",
  "penanggungJawab": "string",
  "jadwalPelaksanaan": "string",
  "biaya": 5000000,
  "sumberPembiayaan": "string",
  "statusKemajuan": "BELUM_MULAI | SEDANG_BERJALAN | SELESAI | TERTUNDA",
  "kendalaKeuangan": false,
  "kendalaTenagaKerja": false,
  "prioritas": "PENDEK | MENENGAH | PANJANG"
}
```
> Catatan: `prioritas` di sini adalah **jangka waktu pelaksanaan** (pendek/menengah/panjang), bukan level urgensi — sesuai kolom "Skala Prioritas" di Tabel 5.1 sumber data. Tidak ada field `tingkatRisikoDenganPengendalian` tersendiri di M5 — kalau FE butuh tampilkan itu, ambil dari relasi `kajiUlangRisiko.tingkatRisikoSetelah` (include saat query, jangan duplikat datanya di tabel M5).

### 5.5 M6 — Pemantauan Operasional (`/pemantauan`)

> **Perbaikan dari versi sebelumnya:** relasinya **langsung & wajib ke M4** (`kajiUlangRisikoId`, unique, required) sesuai schema.prisma final — bukan opsional ke M5 (`rencanaPerbaikanId`, nullable) seperti draf awal. Artinya M5 dan M6 adalah **dua cabang paralel** di bawah satu record Kaji Ulang Risiko (masing-masing maksimal satu per Kaji Ulang), bukan rantai berurutan M4→M5→M6. Kalau alur bisnis sebenarnya butuh M6 mensyaratkan M5 sudah ada duluan, itu **perlu perubahan schema** (tambah relasi M5→M6), bukan sekadar dokumen ini — belum dilakukan, konfirmasi ke stakeholder dulu.

Request body (nama field mengikuti schema persis, cukup panjang — jangan disingkat):
```json
{
  "kajiUlangRisikoId": "string",
  "batasKritis": "string",
  "apaYangDimonitor": "string",
  "dimana": "string",
  "kapan": "string",
  "bagaimana": "string",
  "siapaYangMelakukan": "string",
  "siapaYangAkanMenganalisisHasilnya": "string",
  "siapaYangMenerimaHasilAnalisisDanMengambilTindakan": "string",
  "apaTindakanKoreksinya": "string",
  "siapaYangMelakukanTindakanKoreksi": "string",
  "seberapaCepat": "string",
  "siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni": "string"
}
```
Tidak ada field skor di M6 — skor risiko sudah final dihitung di M2/M4.

---

## 6. Import Excel

| Method | Path | Role | Deskripsi |
|---|---|---|---|
| `POST` | `/import/:module` | Admin, User | Upload file `.xlsx` untuk modul tertentu |

`:module` ∈ `identifikasi-bahaya`, `penilaian-risiko`, `kaji-ulang`, `rencana-perbaikan`, `pemantauan`, `users` (Admin only untuk `users`).

Request: `multipart/form-data`, field `file`.

Template M1 (`identifikasi-bahaya`) **tidak boleh punya kolom `kodeRisiko` sebagai wajib** — kalau ada isinya, backend abaikan dan tetap generate sendiri per baris (`rpam-backend` skill §7).

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
      { "row": 12, "errors": ["lokasiSpamId wajib diisi"] },
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

Response data — key `distribusiTingkatRisiko` pakai value enum `TingkatRisiko` persis (§1.5), bukan title-case:
```json
{
  "jumlahUserAktif": 15,
  "totalDataRpam": { "identifikasiBahaya": 40, "penilaianRisiko": 40, "kajiUlang": 12, "rencanaPerbaikan": 8, "pemantauan": 20 },
  "distribusiTingkatRisiko": { "RENDAH": 10, "MEDIUM": 15, "TINGGI": 8, "SANGAT_TINGGI": 5, "EKSTREM": 2 },
  "aktivitasTerbaru": [
    { "user": "string", "aksi": "CREATE", "module": "identifikasi-bahaya", "createdAt": "2026-07-03T10:00:00Z" }
  ]
}
```
> `jumlahUserAktif` hanya relevan/terlihat penuh untuk Admin (FR-35); User tetap bisa hit endpoint yang sama tapi FE boleh sembunyikan widget ini untuk role User sesuai RBAC (`rpam-frontend` skill §7).

---

## 9. Ringkasan Asumsi & Keputusan Struktural

| # | Item | Status |
|---|---|---|
| 1 | M2 relasi 1-ke-1 ke M1 via `identifikasiBahayaId` | **Final** — sudah di schema.prisma |
| 2 | M4 relasi 1-ke-1 ke M2 via `penilaianRisikoId` | **Final** |
| 3 | M5 relasi 1-ke-1 ke M4 via `kajiUlangRisikoId` | **Final** |
| 4 | M6 relasi 1-ke-1 **wajib** ke M4 via `kajiUlangRisikoId` (bukan ke M5, bukan nullable) | **Final** — koreksi dari draf sebelumnya yang salah asumsi opsional-ke-M5 |
| 5 | M5 dan M6 adalah cabang paralel di bawah M4, tidak ada relasi M5→M6 di database | **Perlu dikonfirmasi** kalau alur bisnis sebenarnya butuh M6 bergantung pada M5 — saat ini schema tidak mendukung itu |
| 6 | M6 tidak punya field skor | **Final** — skor sudah selesai di M2/M4 |
| 7 | `kodeRisiko` M1 auto-generate backend, format `{PREFIX}{4 digit}` per tipeBahaya | **Final**, lihat `rpam-backend` skill §5a |
| 8 | Import data duplikat: skip + laporkan, bukan overwrite | **Asumsi**, TC-53 tidak spesifik |
| 9 | Reset password user belum ada endpoint | **Asumsi**, tidak disebut di FR-06–FR-10 |
| 10 | Tidak ada endpoint `logout` server-side (kecuali audit trail) | **Final**, sesuai "logout hanya hapus token client" |
| 11 | Default `pageSize` = 10, dikonsumsi FE sebagai infinite scroll | **Final** |
| 12 | ID pakai `cuid()` (bukan NanoID seperti disebut draf skill awal) | **Konflik dokumen, belum diputuskan** — lihat §1.3 |

---

## 10. Referensi

- `rpam-backend` skill (`prd.md`) — implementasi detail, RBAC middleware, audit log service, risk-score helper, kode risiko generation, integration testing.
- `rpam-backend` requirement (`task.md`) — alur modul, business rules.
- `rpam-frontend` skill (`fe/task.md`) — cara FE konsumsi endpoint ini (Axios convention, unwrap `data`, Redux slice shape, infinite scroll).
- `fe/prd.md` — requirement level produk untuk FE.
- `schema.prisma` — sumber kebenaran final untuk nama field & tipe data.
- Dokumen asli: Project Overview, FR-01–FR-35, NFR-01–NFR-37, Test Plan TS-01–TS-15.