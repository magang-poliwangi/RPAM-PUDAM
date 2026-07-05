/*
  Warnings:

  - You are about to drop the column `kodeLokasi` on the `identifikasi_bahaya` table. All the data in the column will be lost.
  - You are about to drop the column `dampakSetelah` on the `kaji_ulang_risiko` table. All the data in the column will be lost.
  - You are about to drop the column `peluangSetelah` on the `kaji_ulang_risiko` table. All the data in the column will be lost.
  - You are about to drop the column `skorSetelah` on the `kaji_ulang_risiko` table. All the data in the column will be lost.
  - You are about to drop the column `analis` on the `pemantauan_operasional` table. All the data in the column will be lost.
  - You are about to drop the column `apaYangDipantau` on the `pemantauan_operasional` table. All the data in the column will be lost.
  - You are about to drop the column `pelaksana` on the `pemantauan_operasional` table. All the data in the column will be lost.
  - You are about to drop the column `pelaksanaKoreksi` on the `pemantauan_operasional` table. All the data in the column will be lost.
  - You are about to drop the column `penerimaLaporan` on the `pemantauan_operasional` table. All the data in the column will be lost.
  - You are about to drop the column `rencanaPerbaikanId` on the `pemantauan_operasional` table. All the data in the column will be lost.
  - You are about to drop the column `tindakanKoreksi` on the `pemantauan_operasional` table. All the data in the column will be lost.
  - You are about to drop the column `waktuKoreksi` on the `pemantauan_operasional` table. All the data in the column will be lost.
  - You are about to drop the column `dampak` on the `penilaian_risiko` table. All the data in the column will be lost.
  - You are about to drop the column `peluang` on the `penilaian_risiko` table. All the data in the column will be lost.
  - You are about to drop the column `jadwal` on the `rencana_perbaikan` table. All the data in the column will be lost.
  - You are about to drop the column `kendala` on the `rencana_perbaikan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[penilaianRisikoId]` on the table `kaji_ulang_risiko` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kajiUlangRisikoId]` on the table `pemantauan_operasional` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifikasiBahayaId]` on the table `penilaian_risiko` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kajiUlangRisikoId]` on the table `rencana_perbaikan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lokasiSpamId` to the `identifikasi_bahaya` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dampakKeparahan` to the `kaji_ulang_risiko` table without a default value. This is not possible if the table is not empty.
  - Added the required column `peluangKejadianBahaya` to the `kaji_ulang_risiko` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skorRisiko` to the `kaji_ulang_risiko` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apaTindakanKoreksinya` to the `pemantauan_operasional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apaYangDimonitor` to the `pemantauan_operasional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kajiUlangRisikoId` to the `pemantauan_operasional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seberapaCepat` to the `pemantauan_operasional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siapaYangAkanMenganalisisHasilnya` to the `pemantauan_operasional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siapaYangMelakukan` to the `pemantauan_operasional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siapaYangMelakukanTindakanKoreksi` to the `pemantauan_operasional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siapaYangMenerimaHasilAnalisisDanMengambilTindakan` to the `pemantauan_operasional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni` to the `pemantauan_operasional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dampakKeparahan` to the `penilaian_risiko` table without a default value. This is not possible if the table is not empty.
  - Added the required column `peluangKejadianBahaya` to the `penilaian_risiko` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jadwalPelaksanaan` to the `rencana_perbaikan` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `statusKemajuan` on the `rencana_perbaikan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `prioritas` on the `rencana_perbaikan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PrioritasRencanaPerbaikan" AS ENUM ('PENDEK', 'MENENGAH', 'PANJANG');

-- DropForeignKey
ALTER TABLE "pemantauan_operasional" DROP CONSTRAINT "pemantauan_operasional_rencanaPerbaikanId_fkey";

-- DropIndex
DROP INDEX "identifikasi_bahaya_kodeRisiko_key";

-- AlterTable
ALTER TABLE "identifikasi_bahaya" DROP COLUMN "kodeLokasi",
ADD COLUMN     "lokasiSpamId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "kaji_ulang_risiko" DROP COLUMN "dampakSetelah",
DROP COLUMN "peluangSetelah",
DROP COLUMN "skorSetelah",
ADD COLUMN     "dampakKeparahan" INTEGER NOT NULL,
ADD COLUMN     "peluangKejadianBahaya" INTEGER NOT NULL,
ADD COLUMN     "skorRisiko" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "pemantauan_operasional" DROP COLUMN "analis",
DROP COLUMN "apaYangDipantau",
DROP COLUMN "pelaksana",
DROP COLUMN "pelaksanaKoreksi",
DROP COLUMN "penerimaLaporan",
DROP COLUMN "rencanaPerbaikanId",
DROP COLUMN "tindakanKoreksi",
DROP COLUMN "waktuKoreksi",
ADD COLUMN     "apaTindakanKoreksinya" TEXT NOT NULL,
ADD COLUMN     "apaYangDimonitor" TEXT NOT NULL,
ADD COLUMN     "kajiUlangRisikoId" TEXT NOT NULL,
ADD COLUMN     "seberapaCepat" TEXT NOT NULL,
ADD COLUMN     "siapaYangAkanMenganalisisHasilnya" TEXT NOT NULL,
ADD COLUMN     "siapaYangMelakukan" TEXT NOT NULL,
ADD COLUMN     "siapaYangMelakukanTindakanKoreksi" TEXT NOT NULL,
ADD COLUMN     "siapaYangMenerimaHasilAnalisisDanMengambilTindakan" TEXT NOT NULL,
ADD COLUMN     "siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni" TEXT NOT NULL,
ALTER COLUMN "batasKritis" DROP NOT NULL;

-- AlterTable
ALTER TABLE "penilaian_risiko" DROP COLUMN "dampak",
DROP COLUMN "peluang",
ADD COLUMN     "dampakKeparahan" INTEGER NOT NULL,
ADD COLUMN     "peluangKejadianBahaya" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "rencana_perbaikan" DROP COLUMN "jadwal",
DROP COLUMN "kendala",
ADD COLUMN     "jadwalPelaksanaan" TEXT NOT NULL,
ADD COLUMN     "kendalaKeuangan" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kendalaTenagaKerja" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "statusKemajuan",
ADD COLUMN     "statusKemajuan" TEXT NOT NULL,
DROP COLUMN "prioritas",
ADD COLUMN     "prioritas" "PrioritasRencanaPerbaikan" NOT NULL;

-- DropEnum
DROP TYPE "Prioritas";

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

-- CreateIndex
CREATE UNIQUE INDEX "lokasi_spam_kodeLokasi_key" ON "lokasi_spam"("kodeLokasi");

-- CreateIndex
CREATE UNIQUE INDEX "kaji_ulang_risiko_penilaianRisikoId_key" ON "kaji_ulang_risiko"("penilaianRisikoId");

-- CreateIndex
CREATE UNIQUE INDEX "pemantauan_operasional_kajiUlangRisikoId_key" ON "pemantauan_operasional"("kajiUlangRisikoId");

-- CreateIndex
CREATE UNIQUE INDEX "penilaian_risiko_identifikasiBahayaId_key" ON "penilaian_risiko"("identifikasiBahayaId");

-- CreateIndex
CREATE UNIQUE INDEX "rencana_perbaikan_kajiUlangRisikoId_key" ON "rencana_perbaikan"("kajiUlangRisikoId");

-- AddForeignKey
ALTER TABLE "identifikasi_bahaya" ADD CONSTRAINT "identifikasi_bahaya_lokasiSpamId_fkey" FOREIGN KEY ("lokasiSpamId") REFERENCES "lokasi_spam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pemantauan_operasional" ADD CONSTRAINT "pemantauan_operasional_kajiUlangRisikoId_fkey" FOREIGN KEY ("kajiUlangRisikoId") REFERENCES "kaji_ulang_risiko"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
