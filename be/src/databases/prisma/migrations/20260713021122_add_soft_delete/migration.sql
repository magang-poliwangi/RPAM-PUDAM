/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `lokasi_spam` table. All the data in the column will be lost.
  - You are about to drop the column `jadwal` on the `rencana_perbaikan` table. All the data in the column will be lost.
  - You are about to drop the column `kendala` on the `rencana_perbaikan` table. All the data in the column will be lost.
  - Added the required column `jadwalPelaksanaan` to the `rencana_perbaikan` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `statusKemajuan` on the `rencana_perbaikan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "lokasi_spam" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "rencana_perbaikan" DROP COLUMN "jadwal",
DROP COLUMN "kendala",
ADD COLUMN     "jadwalPelaksanaan" TEXT NOT NULL,
ADD COLUMN     "kendalaKeuangan" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kendalaTenagaKerja" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "statusKemajuan",
ADD COLUMN     "statusKemajuan" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deletedAt" TIMESTAMP(3);
