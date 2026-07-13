/*
  Warnings:

  - Added the required column `tingkatRisiko` to the `rencana_perbaikan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TingkatRisiko" AS ENUM ('RENDAH', 'MEDIUM', 'TINGGI', 'SANGAT_TINGGI');

-- AlterTable
ALTER TABLE "rencana_perbaikan" ADD COLUMN     "tingkatRisiko" "TingkatRisiko" NOT NULL;
