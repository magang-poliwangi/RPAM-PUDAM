# PRD — RPAM Frontend
**Rencana Pengamanan Air Minum: Web Application (Frontend)**

| | |
|---|---|
| Versi | 1.0 |
| Tanggal | 03 Juli 2026 |
| Status | Draft |
| Terkait | `rpam-backend` skill, `rpam-frontend` skill |

---

## 1. Ringkasan Produk

RPAM (Rencana Pengamanan Air Minum) adalah aplikasi web untuk membantu instansi mengelola proses keselamatan air minum: identifikasi bahaya, penilaian risiko, kaji ulang risiko, rencana perbaikan, dan pemantauan operasional. Dokumen ini mendefinisikan kebutuhan khusus **frontend** — konsumen dari REST API backend (Express + Prisma + PostgreSQL).

Target pengguna: maksimal ±20 user aktif bersamaan, dua role (Admin, User). Skala kecil → prioritas kesederhanaan UI dan arsitektur, bukan kompleksitas.

## 2. Tujuan

- Menyediakan antarmuka yang sederhana, cepat dipahami staf instansi (bukan power-user teknis).
- Menyajikan data tabular ala Excel (search, filter, sort, pagination) di semua modul.
- Membedakan hak akses Admin vs User secara jelas di navigasi dan halaman.
- Mendukung alur import/export Excel tanpa kehilangan data.
- Menampilkan skor & level risiko secara konsisten dan otomatis (tidak dihitung di FE — nilai datang dari backend, FE hanya menampilkan).

## 3. Target Pengguna & Role

| Role | Ringkasan Akses |
|---|---|
| **Admin** | CRUD User, CRUD seluruh data RPAM, Import/Export Excel, lihat Audit Log, monitoring aktivitas |
| **User** | Login, CRUD data RPAM, Import/Export Excel, Search/Filter/Sort — tidak bisa kelola User & tidak bisa lihat Audit Log |

Detail matrix RBAC ada di `rpam-backend` skill §3.

## 4. Ruang Lingkup

### In-scope
- Login/Logout
- Manajemen User (Admin only)
- Audit Log viewer + filter (Admin only)
- 5 modul data RPAM: Identifikasi Bahaya (M1), Penilaian Risiko (M2), Kaji Ulang Risiko (M4), Rencana Perbaikan (M5), Pemantauan Operasional (M6)
- Search, filter, sort, pagination di semua tabel data
- Import Excel & Export Excel (per modul dan gabungan multi-sheet)
- Dashboard (jumlah user, aktivitas terbaru, total data RPAM, distribusi tingkat risiko)

### Out-of-scope (tidak diminta requirement, jangan dibangun tanpa instruksi)
- Mobile app / mobile-first responsive design (hanya desktop & laptop — lihat §9)
- Dark mode
- Multi-bahasa (i18n) — Bahasa Indonesia saja
- Notifikasi real-time (WebSocket/push)
- Refresh-token flow di sisi client (backend cuma pakai JWT tunggal 24 jam)

## 5. Tech Stack

React + Vite, Redux Toolkit, Axios, React Router, Tailwind CSS. Testing: Vitest + React Testing Library (unit/Redux), Cypress (integration/e2e). Detail konvensi implementasi ada di `rpam-frontend` skill.

## 6. Kebutuhan Fungsional (FE-relevant, mapping ke FR asli)

### 6.1 Autentikasi (FR-01 s.d. FR-05)
- Halaman login (username + password).
- Pesan error **persis** sesuai spec: *"Username atau Password salah"* (password salah), *"akun tidak ditemukan"* (username tidak ada), validasi field wajib diisi.
- Setelah login sukses → redirect ke dashboard, token JWT disimpan untuk axios interceptor.
- Logout: hapus token di client, redirect ke login. Tidak ada pemanggilan endpoint logout server-side selain menghapus token.

### 6.2 Manajemen User — Admin only (FR-06 s.d. FR-10)
- Tabel user dengan search/filter/sort/pagination.
- Form tambah/edit user, validasi username duplikat (*"username telah digunakan"*).
- Aksi: hapus, ubah role (Admin/User), aktifkan/nonaktifkan akun.
- Halaman ini tidak boleh diakses/di-render sama sekali untuk role User (bukan cuma disembunyikan via CSS).

### 6.3 Audit Log — Admin only (FR-11 s.d. FR-17)
- Tabel riwayat aktivitas (login, logout, create, update, delete) dengan kolom: waktu, user, aktivitas, modul.
- Filter berdasarkan tanggal dan pengguna.

### 6.4 Modul Data RPAM (FR-18 s.d. FR-22)
Setiap modul (M1, M2, M4, M5, M6) punya: tabel list (search/filter/sort/pagination), form tambah/edit, konfirmasi hapus, validasi field wajib.

- **M1 Identifikasi Bahaya**: kode lokasi, kode risiko, komponen SPAM, kontaminasi (X), penyebab (Z), kejadian bahaya (XYZ), tipe bahaya.
- **M2 Penilaian Risiko**: input peluang & dampak → skor dan level risiko **ditampilkan otomatis dari response backend** (FE tidak menghitung ulang), badge warna sesuai §7.
- **M4 Kaji Ulang Risiko**: tindakan pengendalian, referensi, validasi (efektif/tidak efektif/tidak pasti), peluang & dampak baru → skor/level baru ditampilkan otomatis.
- **M5 Rencana Perbaikan**: rencana, PIC, jadwal, biaya, sumber dana, status kemajuan, kendala, prioritas, tingkat risiko dengan pengendalian.
- **M6 Pemantauan Operasional**: batas kritis, apa, dimana, kapan, bagaimana, pelaksana, analis, penerima laporan, tindakan koreksi, pelaksana koreksi, waktu koreksi.

### 6.5 Search / Filter / Sort / Pagination (FR-23 s.d. FR-27)
- Satu komponen `DataTable` reusable dipakai di semua modul (lihat `rpam-frontend` skill §3–§5).
- Pesan saat kata kunci tidak ditemukan: *"Data tidak ditemukan"* (dipakai persis).

### 6.6 Import & Export Excel (FR-28 s.d. FR-32)
- Import: upload `.xlsx`, tampilkan progress/hasil, tampilkan error detail per baris/kolom kalau backend mengembalikan `400` dengan detail.
- Export: tombol export per modul (satu sheet) dan export gabungan (multi-sheet, satu file).

### 6.7 Dashboard (FR-34, FR-35)
- Widget: jumlah user, aktivitas terbaru, total data RPAM, distribusi tingkat risiko.
- Distribusi tingkat risiko ditampilkan sebagai **pie/donut chart** (asumsi, lihat §9).

### 6.8 Hak Akses (§4 doc FR)
- Navigasi (sidebar) menyesuaikan role — item Admin-only (User Management, Audit Log) tidak dirender untuk User.
- Route Admin-only diproteksi di router level, bukan hanya disembunyikan di UI.

## 7. Design System (ringkas — detail token di `rpam-frontend` skill §4)

- **Brand color:** teal (`#0f766e`) — dipilih supaya visually distinct dari warna risk level "Medium" (biru).
- **Risk level palette** (wajib identik dengan backend `getRiskLevel()`):

| Level | Skor | Warna |
|---|---|---|
| Rendah | 1–5 | Hijau |
| Medium | 6–10 | Biru |
| Tinggi | 11–15 | Oranye |
| Sangat Tinggi | 16–20 | Kuning |
| Ekstrem | 21–25 | Merah |

> Catatan: level "Tinggi" dan warnanya adalah asumsi untuk menyelesaikan konflik antar dokumen requirement (lihat `rpam-backend` skill §5) — perlu dikonfirmasi ke product owner.

- Tone visual: sederhana, banyak whitespace, rounded-lg, shadow tipis. Tabel data mirip Excel (grid rapi, header sticky jika memungkinkan).
- Tipografi: sans-serif default Tailwind, maksimal 3 ukuran heading.

## 8. Arsitektur Frontend (ringkas — detail di `rpam-frontend` skill)

- Redux Toolkit: satu slice per modul, shape state konsisten (`items, selected, status, error, pagination`).
- Axios: satu instance dengan interceptor JWT, tanpa refresh-token queue.
- Response backend selalu `{ success, message, data }` — FE unwrap `data` di thunk, tidak bocorkan raw shape ke komponen.
- Komponen di `components/common/` wajib reusable & bebas business logic.

## 9. Asumsi & Gap PRD (belum ditentukan requirement asli)

| # | Gap | Asumsi yang dipakai |
|---|---|---|
| 1 | Tidak ada wireframe/mockup | Ikuti design token §7 + prinsip reusable component, bukan layout ad-hoc per fitur |
| 2 | Chart type untuk "distribusi tingkat risiko" tidak ditentukan | Pie/donut chart |
| 3 | Scope responsif tidak jelas | Desktop & laptop saja (NFR-34), tidak perlu mobile-first |
| 4 | Format tanggal/locale tidak disebutkan | Bahasa Indonesia, format `dd/mm/yyyy` |
| 5 | Accessibility (a11y) tidak disebutkan di NFR | Semantic HTML & label form yang benar sebagai baseline, tanpa full WCAG compliance |
| 6 | Warna level "Tinggi" pada risk badge belum ditentukan | Oranye (lihat §7) — perlu konfirmasi stakeholder |
| 7 | Default page size pagination tidak ditentukan | 10 item/halaman, configurable |
| 8 | Format kolom template Excel per modul tidak ditentukan | Ditentukan saat implementasi, dikomentari di kode, dikonfirmasi ke user sebelum final |

## 10. Strategi Testing

Dua lapis, keduanya wajib per fitur (detail mapping penuh ke Test Plan TS-01–TS-15 ada di `rpam-frontend` skill §8):

- **Vitest** — unit test Redux slice (semua transisi pending/fulfilled/rejected) dan render test komponen `common/`.
- **Cypress** — satu spec per Test Scenario dari Test Plan (`TS-01-login.cy.js`, dst.), setiap `it()` menyebut Test Case ID (TC-xx).

## 11. Kriteria Selesai (Definition of Done — FE)

Sebuah fitur FE dianggap selesai bila:
- UI mengikuti design system §7 dan prinsip reusable component §8.
- RBAC diterapkan di route & navigasi (bukan cuma UI hiding).
- State Redux mengikuti shape konsisten §8.
- Ada Vitest test **dan** Cypress spec yang mapping ke Test Scenario terkait (§10).
- Lolos ESLint tanpa warning baru, tidak ada console error.
- Pesan sukses/error mengikuti copy text asli dari FR/Test Plan (bukan diparafrase).

## 12. Referensi

- `rpam-backend` skill — konvensi backend, RBAC, audit log, risk score formula, integration testing.
- `rpam-frontend` skill — konvensi implementasi FE detail (folder structure, Redux, Axios, design tokens, testing).
- Dokumen asli: Project Overview, Kebutuhan Fungsional (FR-01–FR-35), Kebutuhan Non-Fungsional (NFR-01–NFR-37), Test Plan (TS-01–TS-15).