# PRD — RPAM Frontend
**Rencana Pengamanan Air Minum: Web Application (Frontend)**

| | |
|---|---|
| Versi | 1.1 |
| Tanggal | 05 Juli 2026 |
| Status | Draft |
| Terkait | `rpam-backend` skill, `rpam-frontend` skill |

---

## 1. Ringkasan Produk

RPAM (Rencana Pengamanan Air Minum) adalah aplikasi web untuk membantu instansi mengelola proses keselamatan air minum: identifikasi bahaya, penilaian risiko, kaji ulang risiko, rencana perbaikan, dan pemantauan operasional. Dokumen ini mendefinisikan kebutuhan khusus **frontend** — konsumen dari REST API backend (Express + Prisma + PostgreSQL).

Target pengguna: maksimal ±20 user aktif bersamaan, dua role (Admin, User). Skala kecil → prioritas kesederhanaan UI dan arsitektur, bukan kompleksitas.

## 2. Tujuan

- Menyediakan antarmuka yang sederhana, cepat dipahami staf instansi (bukan power-user teknis).
- Menyajikan data tabular ala Excel (search, filter, sort, infinite scroll) di semua modul.
- Membedakan hak akses Admin vs User secara jelas di navigasi dan halaman.
- Mendukung alur import/export Excel tanpa kehilangan data.
- Menampilkan skor & level risiko secara konsisten dan otomatis (tidak dihitung di FE — nilai datang dari backend, FE hanya menampilkan).
- Menampilkan kode risiko yang di-generate backend (FE tidak pernah meminta user mengisi kode risiko sendiri).

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
- Search, filter, sort, infinite scroll di semua tabel data
- Import Excel & Export Excel (per modul dan gabungan multi-sheet)
- Dashboard (jumlah user, aktivitas terbaru, total data RPAM, distribusi tingkat risiko)

### Out-of-scope (tidak diminta requirement, jangan dibangun tanpa instruksi)
- Mobile app / mobile-first responsive design (hanya desktop & laptop — lihat §9)
- Dark mode
- Multi-bahasa (i18n) — Bahasa Indonesia saja
- Notifikasi real-time (WebSocket/push)
- Refresh-token flow di sisi client (backend cuma pakai JWT tunggal 24 jam)
- Pagination bernomor halaman klasik (lihat §9 gap #7 — dipilih infinite scroll)

## 5. Tech Stack

React + Vite, Redux Toolkit, Axios, React Router, Tailwind CSS. Testing: Vitest + React Testing Library (unit/Redux), Cypress (integration/e2e). Detail konvensi implementasi ada di `rpam-frontend` skill.

## 6. Kebutuhan Fungsional (FE-relevant, mapping ke FR asli)

### 6.1 Autentikasi (FR-01 s.d. FR-05)
- Halaman login (username + password).
- Pesan error **persis** sesuai spec: *"Username atau Password salah"* (password salah), *"akun tidak ditemukan"* (username tidak ada), validasi field wajib diisi.
- Setelah login sukses → redirect ke dashboard, token JWT disimpan untuk axios interceptor.
- Logout: hapus token di client, redirect ke login. Tidak ada pemanggilan endpoint logout server-side selain menghapus token.

### 6.2 Manajemen User — Admin only (FR-06 s.d. FR-10)
- Tabel user dengan search/filter/sort/infinite scroll.
- Form tambah/edit user, validasi username duplikat (*"username telah digunakan"*).
- Aksi: hapus, ubah role (Admin/User), aktifkan/nonaktifkan akun.
- Halaman ini tidak boleh diakses/di-render sama sekali untuk role User (bukan cuma disembunyikan via CSS).

### 6.3 Audit Log — Admin only (FR-11 s.d. FR-17)
- Tabel riwayat aktivitas (login, logout, create, update, delete) dengan kolom: waktu, user, aktivitas, modul.
- Filter berdasarkan tanggal dan pengguna.
- Backend menyimpan `oldValue`/`newValue` (JSON, optional) per entri — tampilkan sebagai detail yang bisa di-expand per baris (mis. klik baris untuk lihat before/after), bukan kolom tersendiri di tabel utama (supaya tabel tetap ringkas).

### 6.4 Modul Data RPAM (FR-18 s.d. FR-22)
Setiap modul (M1, M2, M4, M5, M6) punya: tabel list (search/filter/sort/infinite scroll), form tambah/edit, konfirmasi hapus, validasi field wajib.

- **M1 Identifikasi Bahaya**: kode lokasi, komponen SPAM, kontaminasi (X), penyebab (Z), kejadian bahaya (XYZ), tipe bahaya. **Kode risiko tidak ada input-nya di form** — di-generate backend saat submit, tampilkan sebagai teks read-only di tabel/detail setelah data tersimpan.
- **M2 Penilaian Risiko**: input peluang & dampak → skor dan level risiko **ditampilkan otomatis dari response backend** (FE tidak menghitung ulang), badge warna sesuai §7.
- **M4 Kaji Ulang Risiko**: tindakan pengendalian, referensi, validasi (efektif/tidak efektif/tidak pasti), peluang & dampak setelah pengendalian → skor/level baru ditampilkan otomatis. (Field API di backend bernama `peluangSetelah`/`dampakSetelah`/`skorSetelah`/`tingkatRisikoSetelah` — pakai nama itu persis saat mapping payload, jangan disamakan dengan nama field M2.)
- **M5 Rencana Perbaikan**: rencana, PIC, jadwal, biaya, sumber dana, status kemajuan (dropdown: Belum Mulai / Sedang Berjalan / Selesai / Tertunda), kendala (keuangan/tenaga kerja, checkbox), prioritas (dropdown: Pendek / Menengah / Panjang — ini jangka waktu pelaksanaan, **bukan** level urgensi rendah/sedang/tinggi), tingkat risiko dengan pengendalian (read-only, dari M4).
- **M6 Pemantauan Operasional**: batas kritis, apa, dimana, kapan, bagaimana, pelaksana, analis, penerima laporan, tindakan koreksi, pelaksana koreksi, waktu koreksi, penerima laporan tindakan koreksi.

### 6.5 Search / Filter / Sort / Infinite Scroll (FR-23 s.d. FR-27)
- Satu komponen `DataTable` reusable dipakai di semua modul (lihat `rpam-frontend` skill §3–§5).
- Pesan saat kata kunci tidak ditemukan: *"Data tidak ditemukan"* (dipakai persis).
- Pagination **bukan** bernomor halaman — pakai infinite scroll (fetch batch berikutnya saat user scroll mendekati akhir tabel). Lihat §9 gap #7 untuk ukuran batch default.

### 6.6 Import & Export Excel (FR-28 s.d. FR-32)
- Import: upload `.xlsx`, tampilkan progress/hasil, tampilkan error detail per baris/kolom kalau backend mengembalikan `400` dengan detail.
- Kolom "Kode Risiko" tidak perlu (dan tidak boleh diwajibkan) ada di template import M1 — backend generate otomatis per baris saat import.
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
| Tinggi | 11–15 | Abu-abu |
| Sangat Tinggi | 16–20 | Kuning |
| Ekstrem | 21–25 | Merah |

> Sudah dikonfirmasi lewat FR terbaru dan disinkronkan dengan `rpam-backend` prd.md §5: level "Tinggi" = **abu-abu** (bukan oranye seperti draft sebelumnya). Kalau ada versi FE yang masih pakai oranye untuk badge ini, itu ketinggalan zaman — update ke abu-abu.

- Tone visual: sederhana, banyak whitespace, rounded-lg, shadow tipis. Tabel data mirip Excel (grid rapi, header sticky jika memungkinkan).
- Tipografi: sans-serif default Tailwind, maksimal 3 ukuran heading.

## 8. Arsitektur Frontend (ringkas — detail di `rpam-frontend` skill)

- Redux Toolkit: satu slice per modul, shape state konsisten (`items, selected, status, error, pagination`), `items` di-append (bukan direplace) tiap batch infinite scroll berikutnya.
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
| 6 | Warna level "Tinggi" pada risk badge | **Sudah dikonfirmasi: Abu-abu** — sinkron dengan `rpam-backend` prd.md §5, bukan lagi open question |
| 7 | Mekanisme "pagination" tidak ditentukan bentuknya | Infinite scroll (bukan page-number), batch fetch 10–20 item per load, konsisten dengan `rpam-frontend` skill §4/§5 |
| 8 | Format kolom template Excel per modul tidak ditentukan | Ditentukan saat implementasi, dikomentari di kode, dikonfirmasi ke user sebelum final |

## 10. Strategi Testing

Dua lapis, keduanya wajib per fitur (detail mapping penuh ke Test Plan TS-01–TS-15 ada di `rpam-frontend` skill §8):

- **Vitest** — unit test Redux slice (semua transisi pending/fulfilled/rejected, termasuk append batch infinite scroll) dan render test komponen `common/`.
- **Cypress** — satu spec per Test Scenario dari Test Plan (`TS-01-login.cy.js`, dst.), setiap `it()` menyebut Test Case ID (TC-xx).

## 11. Kriteria Selesai (Definition of Done — FE)

Sebuah fitur FE dianggap selesai bila:
- UI mengikuti design system §7 dan prinsip reusable component §8.
- RBAC diterapkan di route & navigasi (bukan cuma UI hiding).
- State Redux mengikuti shape konsisten §8, infinite scroll append bukan replace.
- Ada Vitest test **dan** Cypress spec yang mapping ke Test Scenario terkait (§10).
- Lolos ESLint tanpa warning baru, tidak ada console error.
- Pesan sukses/error mengikuti copy text asli dari FR/Test Plan (bukan diparafrase).
- Form M1 tidak punya field input untuk kode risiko.

## 12. Referensi

- `rpam-backend` skill — konvensi backend, RBAC, audit log, risk score formula, kode risiko generation, integration testing.
- `rpam-frontend` skill — konvensi implementasi FE detail (folder structure, Redux, Axios, design tokens, testing).
- Dokumen asli: Project Overview, Kebutuhan Fungsional (FR-01–FR-35), Kebutuhan Non-Fungsional (NFR-01–NFR-37), Test Plan (TS-01–TS-15).

---

# Input Form (catatan implementasi komponen)

- Input dibuat jadi **component**, bukan **page** (dipanggil dari dalam modal/drawer di halaman list masing-masing modul).

### FR-18 Identifikasi Bahaya (Tabel 3.1)
Sistem memungkinkan pengguna melakukan: tambah data, ubah data, hapus data, melihat data.

Field yang diinput user:
- Kode Lokasi (dropdown, relasi ke Lokasi SPAM)
- Komponen SPAM
- Kontaminasi (X)
- Komponen SPAM (Y)
- Penyebab (Z)
- Kejadian Bahaya (XYZ)
- Tipe Bahaya

**Kode Risiko bukan field input** — ditampilkan read-only setelah data tersimpan (auto-generate backend).

### FR-19 Penilaian Risiko (Tabel 3.5)
Form mengelola:
- Identifikasi Bahaya (relasi) — dropdown dari M1
- Peluang
- Dampak
- Skor Risiko (read-only, dihitung backend)
- Tingkat Risiko (read-only, badge warna)

Skor Risiko = Peluang × Dampak. Tingkat Risiko ditentukan otomatis dari skor:

| Skor | Tingkat | Warna |
|---|---|---|
| 1–5 | Rendah | Hijau |
| 6–10 | Medium | Biru |
| 11–15 | Tinggi | Abu-abu |
| 16–20 | Sangat Tinggi | Kuning |
| 21–25 | Ekstrem | Merah |

### FR-20 Kaji Ulang Risiko (M4)
Form mengelola:
- Penilaian Risiko (relasi) — dropdown dari M2
- Tindakan pengendalian
- Referensi
- Validasi: Efektif / Tidak Efektif / Tidak Pasti
- Peluang setelah pengendalian
- Dampak setelah pengendalian
- Skor & Tingkat Risiko setelah pengendalian (read-only, dihitung backend, tabel skor sama seperti FR-19 di atas)

### FR-21 Rencana Perbaikan (M5)
Form mengelola:
- Kaji Ulang (relasi) — dropdown dari M4
- Rencana perbaikan
- Penanggung jawab
- Jadwal
- Biaya
- Sumber pembiayaan
- Status kemajuan: Belum Mulai / Sedang Berjalan / Selesai / Tertunda
- Kendala: Keuangan / Tenaga Kerja (checkbox, boleh keduanya)
- Prioritas: Pendek / Menengah / Panjang (jangka waktu pelaksanaan)
- Tingkat Risiko Dengan Pengendalian (read-only, dari M4)

### FR-22 Pemantauan Operasional (M6.2)
Form mengelola:
- Rencana Perbaikan (relasi) — dropdown dari M5
- Batas kritis
- Apa yang dipantau
- Dimana
- Kapan
- Bagaimana
- Pelaksana
- Analis
- Penerima laporan
- Tindakan koreksi
- Pelaksana koreksi
- Waktu koreksi