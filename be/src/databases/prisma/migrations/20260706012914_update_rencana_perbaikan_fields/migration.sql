/*
  Warnings:

  - You are about to drop the column `jadwalPelaksanaan` on the `rencana_perbaikan` table. All the data in the column will be lost.
  - You are about to drop the column `kendalaKeuangan` on the `rencana_perbaikan` table. All the data in the column will be lost.
  - You are about to drop the column `kendalaTenagaKerja` on the `rencana_perbaikan` table. All the data in the column will be lost.
  - The `statusKemajuan` column on the `rencana_perbaikan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `jadwal` to the `rencana_perbaikan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "identifikasi_bahaya" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "kaji_ulang_risiko" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "lokasi_spam" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "pemantauan_operasional" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "penilaian_risiko" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "rencana_perbaikan" DROP COLUMN "jadwalPelaksanaan",
DROP COLUMN "kendalaKeuangan",
DROP COLUMN "kendalaTenagaKerja",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "jadwal" TEXT NOT NULL,
ADD COLUMN     "kendala" TEXT,
DROP COLUMN "statusKemajuan",
ADD COLUMN     "statusKemajuan" "StatusKemajuan" NOT NULL DEFAULT 'BELUM_MULAI';
