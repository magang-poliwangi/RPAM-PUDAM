/*
  Warnings:

  - You are about to drop the column `tingkatRisiko` on the `rencana_perbaikan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rencana_perbaikan" DROP COLUMN "tingkatRisiko";

-- DropEnum
DROP TYPE "TingkatRisiko";
