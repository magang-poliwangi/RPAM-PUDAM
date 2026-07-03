---
name: rpam-backend
description: "Use this skill whenever writing, editing, or reviewing backend code for the RPAM (Rencana Pengamanan Air Minum) application — a Node.js/Express/Prisma/PostgreSQL app for managing drinking-water safety-plan data (hazard identification, risk assessment, risk review, improvement plans, operational monitoring). Trigger this for ANY task touching the be/ folder — creating controllers, repositories, routes, or validators; writing Prisma schema or migrations; implementing RBAC, audit log, or Excel import/export; writing integration tests for any feature; or creating a new git branch for this project. Do not skip this skill even for small changes — it encodes folder conventions, risk-score formulas, mandatory integration-test mapping per Test Plan, and hard rules that must not be violated."
---

# RPAM Backend Skill

Reference for all backend work on the RPAM app. Read this before writing any code, schema, or route in this project.

## 1. Project Summary

RPAM helps an institution manage drinking-water safety plans: hazard identification → risk assessment → risk review → improvement plans → operational monitoring. ~20 active users max — **no microservices, no Redis, just layered architecture**.

**Stack:** Node.js, Express, Prisma ORM, PostgreSQL, Joi, Multer, JWT, NanoID, bcrypt, CORS, Nodemon, ESLint. Frontend (separate): React + Vite + Redux Toolkit + Axios + React Router + Tailwind.

## 2. Folder Structure (do not change without instruction)

Feature-based modules under `src/`, each with controller/repository/route/validator:

```
be/src/
 ┣ databases/
 ┃ ┣ generated/prisma/      (Prisma client output, do not hand-edit)
 ┃ ┣ prisma/
 ┃ ┃ ┣ migrations/
 ┃ ┃ ┗ schema.prisma
 ┃ ┣ client.js
 ┃ ┗ prisma.config.ts
 ┣ exceptions/
 ┃ ┣ client-error.js
 ┃ ┗ error.js
 ┣ middlewares/
 ┃ ┣ authenticate-token.js   (JWT check)
 ┃ ┣ error-handling.js
 ┃ ┗ validate.js             (Joi validation wrapper)
 ┣ security/
 ┃ ┗ token-manager.js
 ┣ services/
 ┣ test/
 ┣ utils/
 ┃ ┗ response.js             ({ success, message, data } shape)
 ┣ container.js
 ┣ env.js
 ┣ routes.js
 ┗ server.js
```

Each feature module (e.g. `authentikasi/`, `identifikasi-bahaya/`, `penilaian-risiko/`) follows this pattern:
```
<module>/
 ┣ <module>.controller.js
 ┣ <module>.repository.js
 ┣ <module>.route.js
 ┗ <module>.validator.js
```
Before creating a new file, check if a similar one already exists and reuse it.

## 3. Roles & RBAC

| Capability | Admin | User |
|---|---|---|
| CRUD User, activate/deactivate, change role | ✅ | ❌ |
| CRUD all RPAM data (M1–M6) | ✅ | ✅ |
| Import / Export Excel | ✅ | ✅ |
| View Audit Log | ✅ | ❌ |
| Monitoring aktivitas pengguna | ✅ | ❌ |
| Search / Filter / Sort | ✅ | ✅ |

Implement via an authorization middleware that checks `req.user.role` — apply on top of the JWT auth middleware, never instead of it. All endpoints except `POST /auth/login` require the auth middleware.

## 4. Auth

- Login via `username` + `password` → returns JWT (24h expiry). No refresh token flow (not required by NFRs).
- Logout is client-side only (just discard the token) — no server-side blacklist needed at this scale.
- Passwords hashed with bcrypt. Never store or log plaintext passwords.

## 5. RPAM Modules & Business Rules

### M1 — Identifikasi Bahaya
CRUD. Fields: kode lokasi, kode risiko, komponen SPAM, kontaminasi (X), penyebab (Z), kejadian bahaya (XYZ), tipe bahaya.

### M2 — Penilaian Risiko
Fields: peluang, dampak → **skor dan level dihitung otomatis, jangan pernah dihitung manual di controller — selalu panggil helper function**, e.g. `src/utils/risk-calculator.js`:

```js
function calculateRiskScore(peluang, dampak) {
  return peluang * dampak;
}

function getRiskLevel(score) {
  if (score >= 1 && score <= 5) return { level: 'Rendah', color: 'hijau' };
  if (score >= 6 && score <= 10) return { level: 'Medium', color: 'biru' };
  if (score >= 11 && score <= 15) return { level: 'Tinggi', color: 'oranye' }; // ASUMSI: warna belum ditentukan di requirement, konfirmasi ke stakeholder
  if (score >= 16 && score <= 20) return { level: 'Sangat Tinggi', color: 'kuning' };
  if (score >= 21 && score <= 25) return { level: 'Ekstrem', color: 'merah' };
  throw new Error('Invalid risk score');
}
```

> **Catatan konflik requirement:** Dokumen "Project Overview" mendefinisikan 5 tingkat risiko (1-5/6-10/11-15/16-20/21-25). Dokumen FR-19 hanya menyebut 4 tingkat dan melewati rentang 11-15 (tidak ada level "Tinggi"), serta pakai `>21` alih-alih `21-25`. Skill ini memakai versi 5-tingkat di atas sebagai acuan karena mencakup seluruh rentang 1-25 tanpa celah. **Ini asumsi — perlu dikonfirmasi ke product owner**, terutama warna untuk level "Tinggi".

### M4 — Kaji Ulang Risiko
Fields: tindakan (pengendalian), referensi, validasi (efektif / tidak efektif / tidak pasti), peluang baru, dampak baru → skor & level setelah pengendalian dihitung ulang lewat helper function yang sama.

### M5 — Rencana Perbaikan
Fields: rencana perbaikan, PIC/penanggung jawab, jadwal, biaya, sumber dana/pembiayaan, status kemajuan, kendala, prioritas, tingkat risiko dengan pengendalian.

> Asumsi: field `jadwal` dan `kendala` (dari FR-21) ditambahkan ke schema meskipun tidak ada di daftar field Project Overview — versi FR dipakai karena lebih lengkap.

### M6 — Pemantauan Operasional
Fields: batas kritis, apa, dimana, kapan, bagaimana, pelaksana, analis, penerima laporan, tindakan koreksi, pelaksana koreksi, waktu koreksi. Score dihitung otomatis (pakai helper yang sama jika modul ini juga punya peluang/dampak; jika tidak, jangan buat field skor kosong — konfirmasi ke stakeholder).

### Semua modul CRUD
Setiap tabel data wajib mendukung: search, filter, sort, pagination (buat jadi infinite scroll).

## 6. Audit Log

Wajib dicatat untuk: Login, Logout, Create, Update, Delete — pada SEMUA modul data, bukan cuma sebagian.

Minimal schema:
```
{
  user,
  timestamp,
  action,      // LOGIN | LOGOUT | CREATE | UPDATE | DELETE
  module,      // e.g. "identifikasi-bahaya"
  oldValue?,   // JSON, optional
  newValue?,   // JSON, optional
}
```
Implement audit logging as a reusable service (e.g. `services/audit-log.service.js`) called from repository/controller layer after each mutating operation — don't duplicate the write logic per module.

**Delete policy (asumsi, belum ditentukan di requirement):** gunakan **soft delete** (`deletedAt` timestamp) alih-alih hard delete, supaya `oldValue` tetap bisa direkam di audit log setelah data "dihapus". Semua query list/read wajib exclude record dengan `deletedAt != null` kecuali endpoint khusus admin untuk lihat data terhapus (jika dibutuhkan nanti).

## 7. Import / Export Excel

- Import pakai Multer. Validasi: extension harus `.xlsx`, template harus sesuai (kolom wajib ada), field wajib harus terisi. Gagal → `400 Bad Request` dengan detail error per baris/kolom.
- Export: setiap modul bisa diekspor sendiri-sendiri; export "semua data" menghasilkan satu file dengan banyak sheet (satu sheet per modul).
- **Belum ditentukan:** urutan/nama kolom exact di template Excel per modul. Saat implementasi, tulis asumsi kolom di komentar kode dan konfirmasi ke user sebelum finalisasi template.

## 8. API Convention

REST, response selalu lewat `src/utils/response.js`:
```json
{ "success": true, "message": "...", "data": {} }
```
Contoh: `GET /users`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`.

## 9. Validation & Security (hard rules)

- Semua request body divalidasi pakai **Joi** — tidak ada validasi manual.
- Semua endpoint kecuali login pakai JWT auth middleware.
- RBAC pakai middleware authorization terpisah dari authentication.
- Password: bcrypt hash.
- Semua ID unik pakai NanoID kecuali requirement bilang lain.
- Query database: **selalu Prisma ORM**, raw SQL cuma kalau benar-benar tidak bisa dihindari (dan harus dijelaskan alasannya di komentar).

## 10. Non-Functional Targets (ringkas)

- Layani ≥20 concurrent user tanpa penurunan performa signifikan.
- CRUD normal ≤3 detik di jaringan lokal.
- Config (DB, JWT secret, CORS origin, dll) lewat `.env`, jangan hardcode.
- FE dan BE deploy terpisah sebagai service masing-masing.

## 11. Integration Testing (wajib per fitur)

Setiap fitur/endpoint baru **wajib** disertai integration test yang mengacu ke Test Plan RPAM (TS-01 s.d. TS-15). Fitur belum dianggap selesai kalau belum ada test yang cover skenario di bawah untuk modul terkait.

**Mapping modul → test scenario (acuan wajib):**

| Modul/Fitur | Test Scenario | Contoh kasus wajib di-cover |
|---|---|---|
| Login/Logout | TS-01 | login benar, password salah, username tidak ditemukan, field kosong, logout |
| Manajemen User (Admin) | TS-02 | tambah user, username duplikat, edit, hapus, ubah role, nonaktifkan akun |
| Audit Log | TS-03 | login/create/update/delete tercatat, filter by tanggal & user |
| M1 Identifikasi Bahaya | TS-04 | tambah, edit, hapus, field wajib kosong, list data |
| M2 Penilaian Risiko | TS-05 | skor otomatis (termasuk kasus eksak: peluang=3, dampak=4 → skor=12), level berubah sesuai skor, simpan |
| M4 Kaji Ulang | TS-06 | tindakan pengendalian, status efektif/tidak efektif, skor & level baru dihitung ulang |
| M5 Rencana Perbaikan | TS-07 | tambah rencana, PIC, biaya, prioritas, edit |
| M6 Pemantauan | TS-08 | tambah, edit, hapus, list |
| Search | TS-09 | cari by kode risiko, by lokasi, keyword tidak ditemukan |
| Filter | TS-10 | filter lokasi, tingkat risiko, tipe bahaya |
| Sorting | TS-11 | urutkan by kode risiko, tingkat risiko, lokasi |
| Import Excel | TS-12 | file valid, format salah, file kosong, data duplikat |
| Export Excel | TS-13 | export per modul, export semua modul → banyak sheet |
| Dashboard | TS-14 | dashboard tampil, aktivitas terbaru, jumlah user aktif |
| Hak Akses (RBAC) | TS-15 | Admin bisa akses User/Audit Log/hapus/import; User ditolak di User Management & Audit Log tapi bisa CRUD data/export/import/search |

**Aturan penulisan test:**
- Simpan integration test di `src/test/<module>.test.js` (atau sesuai konvensi test runner yang dipakai proyek — cek `src/test/` dulu sebelum bikin pola baru, jangan bikin struktur baru tanpa alasan).
- Test harus hit endpoint asli (mis. lewat supertest), bukan cuma unit-test fungsi helper — karena tujuannya integration testing, bukan unit testing.
- Setiap Test Case ID (TC-xx) yang relevan dengan fitur yang sedang dikerjakan wajib punya test case yang mapping 1:1, dan sebutkan TC-nya di nama test, contoh: `it('TC-24: Peluang=3 Dampak=4 → Skor=12', ...)`.
- Pass criteria mengikuti Test Plan §4: tidak ada error yang menghambat proses utama (critical/high severity), perhitungan skor & level harus benar, RBAC sesuai, import/export tidak boleh kehilangan/merusak data, audit log akurat, search/filter/sort hasilnya sesuai.
- Kalau bikin fitur baru yang belum ada test scenario-nya di Test Plan (di luar TS-01–TS-15), tulis test case baru dengan pola serupa dan catat di komentar/PR description — jangan skip integration test hanya karena tidak ada TC yang eksplisit meng-cover.

## 12. Git Branch Naming Convention

Format: `{github-username}-{action}` dimana `action` adalah salah satu dari `feat`, `fix`, `chore`, `refactor`, `docs`, `test`.

Contoh:
```
nofa-feat
nofa-fix
```

> Catatan: format dasar ini tidak menyertakan deskripsi singkat perubahan, jadi kalau butuh lebih deskriptif (disarankan untuk repo dengan banyak branch), boleh diperpanjang jadi `{github-username}-{action}-{deskripsi-singkat-kebab-case}`, misal `nofa-feat-audit-log-filter`. Pakai format dasar kalau user tidak minta yang lebih detail.

## 13. Hard AI Rules (jangan dilanggar)

- Jangan ubah struktur folder tanpa instruksi eksplisit.
- Jangan hapus kode yang sudah ada.
- Jangan tambah library baru kalau fungsi bisa diselesaikan dengan library yang sudah dipilih (lihat §1 stack).
- Jangan pernah hitung skor risiko manual — selalu lewat helper function (§5).
- Semua Create/Update/Delete wajib mencatat audit log (§6) — tidak ada pengecualian per modul.
- Setiap fitur baru wajib punya integration test sesuai §11 — jangan tandai fitur "selesai" tanpa test yang mapping ke Test Plan.
- Kalau requirement tidak jelas: tulis asumsi di komentar/dokumentasi, jangan mengarang perilaku sistem sendiri. Daftar asumsi yang sudah diketahui ada di §5, §6, §7, §10.
- Sebelum bikin file baru, cek dulu apakah file serupa sudah ada di modul lain, reuse polanya.
- Kode harus lolos ESLint tanpa warning baru, dan tidak ada console error.