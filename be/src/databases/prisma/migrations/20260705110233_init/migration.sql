-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "StatusValidasi" AS ENUM ('EFEKTIF', 'TIDAK_EFEKTIF', 'TIDAK_PASTI');

-- CreateEnum
CREATE TYPE "StatusKemajuan" AS ENUM ('BELUM_MULAI', 'SEDANG_BERJALAN', 'SELESAI', 'TERTUNDA');

-- CreateEnum
CREATE TYPE "PrioritasRencanaPerbaikan" AS ENUM ('PENDEK', 'MENENGAH', 'PANJANG');

-- CreateEnum
CREATE TYPE "AksiAuditLog" AS ENUM ('LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "lokasi_spam" (
    "id" TEXT NOT NULL,
    "kodeLokasi" TEXT NOT NULL,
    "simbol" TEXT,
    "namaLokasi" TEXT,
    "deskripsi" TEXT,
    "penanggungJawabNama" TEXT,
    "penanggungJawabPosisi" TEXT,
    "penanggungJawabTelepon" TEXT,
    "penanggungJawabEmail" TEXT,
    "referensi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lokasi_spam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "aksi" "AksiAuditLog" NOT NULL,
    "namaTabel" TEXT,
    "recordId" TEXT,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identifikasi_bahaya" (
    "id" TEXT NOT NULL,
    "lokasiSpamId" TEXT NOT NULL,
    "kodeRisiko" TEXT NOT NULL,
    "komponenSpam" TEXT NOT NULL,
    "kontaminasiX" TEXT NOT NULL,
    "komponenSpamY" TEXT NOT NULL,
    "penyebabZ" TEXT NOT NULL,
    "kejadianBahayaXYZ" TEXT NOT NULL,
    "tipeBahaya" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identifikasi_bahaya_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penilaian_risiko" (
    "id" TEXT NOT NULL,
    "identifikasiBahayaId" TEXT NOT NULL,
    "peluangKejadianBahaya" INTEGER NOT NULL,
    "dampakKeparahan" INTEGER NOT NULL,
    "skorRisiko" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penilaian_risiko_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kaji_ulang_risiko" (
    "id" TEXT NOT NULL,
    "penilaianRisikoId" TEXT NOT NULL,
    "tindakanPengendalian" TEXT NOT NULL,
    "referensi" TEXT NOT NULL,
    "validasi" "StatusValidasi" NOT NULL,
    "peluangKejadianBahaya" INTEGER NOT NULL,
    "dampakKeparahan" INTEGER NOT NULL,
    "skorRisiko" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kaji_ulang_risiko_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rencana_perbaikan" (
    "id" TEXT NOT NULL,
    "kajiUlangRisikoId" TEXT NOT NULL,
    "rencanaPerbaikan" TEXT NOT NULL,
    "penanggungJawab" TEXT NOT NULL,
    "jadwalPelaksanaan" TEXT NOT NULL,
    "biaya" DECIMAL(65,30) NOT NULL,
    "sumberPembiayaan" TEXT NOT NULL,
    "statusKemajuan" TEXT NOT NULL,
    "kendalaKeuangan" BOOLEAN NOT NULL DEFAULT false,
    "kendalaTenagaKerja" BOOLEAN NOT NULL DEFAULT false,
    "prioritas" "PrioritasRencanaPerbaikan" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rencana_perbaikan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pemantauan_operasional" (
    "id" TEXT NOT NULL,
    "kajiUlangRisikoId" TEXT NOT NULL,
    "batasKritis" TEXT,
    "apaYangDimonitor" TEXT NOT NULL,
    "dimana" TEXT NOT NULL,
    "kapan" TEXT NOT NULL,
    "bagaimana" TEXT NOT NULL,
    "siapaYangMelakukan" TEXT NOT NULL,
    "siapaYangAkanMenganalisisHasilnya" TEXT NOT NULL,
    "siapaYangMenerimaHasilAnalisisDanMengambilTindakan" TEXT NOT NULL,
    "apaTindakanKoreksinya" TEXT NOT NULL,
    "siapaYangMelakukanTindakanKoreksi" TEXT NOT NULL,
    "seberapaCepat" TEXT NOT NULL,
    "siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pemantauan_operasional_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lokasi_spam_kodeLokasi_key" ON "lokasi_spam"("kodeLokasi");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "penilaian_risiko_identifikasiBahayaId_key" ON "penilaian_risiko"("identifikasiBahayaId");

-- CreateIndex
CREATE UNIQUE INDEX "kaji_ulang_risiko_penilaianRisikoId_key" ON "kaji_ulang_risiko"("penilaianRisikoId");

-- CreateIndex
CREATE UNIQUE INDEX "rencana_perbaikan_kajiUlangRisikoId_key" ON "rencana_perbaikan"("kajiUlangRisikoId");

-- CreateIndex
CREATE UNIQUE INDEX "pemantauan_operasional_kajiUlangRisikoId_key" ON "pemantauan_operasional"("kajiUlangRisikoId");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identifikasi_bahaya" ADD CONSTRAINT "identifikasi_bahaya_lokasiSpamId_fkey" FOREIGN KEY ("lokasiSpamId") REFERENCES "lokasi_spam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penilaian_risiko" ADD CONSTRAINT "penilaian_risiko_identifikasiBahayaId_fkey" FOREIGN KEY ("identifikasiBahayaId") REFERENCES "identifikasi_bahaya"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kaji_ulang_risiko" ADD CONSTRAINT "kaji_ulang_risiko_penilaianRisikoId_fkey" FOREIGN KEY ("penilaianRisikoId") REFERENCES "penilaian_risiko"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rencana_perbaikan" ADD CONSTRAINT "rencana_perbaikan_kajiUlangRisikoId_fkey" FOREIGN KEY ("kajiUlangRisikoId") REFERENCES "kaji_ulang_risiko"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemantauan_operasional" ADD CONSTRAINT "pemantauan_operasional_kajiUlangRisikoId_fkey" FOREIGN KEY ("kajiUlangRisikoId") REFERENCES "kaji_ulang_risiko"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
