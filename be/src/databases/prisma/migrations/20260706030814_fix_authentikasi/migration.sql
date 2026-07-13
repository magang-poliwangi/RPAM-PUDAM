/*
  Warnings:

  - The primary key for the `authentikasi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `authentikasi` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "authentikasi_token_key";

-- AlterTable
ALTER TABLE "authentikasi" DROP CONSTRAINT "authentikasi_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "authentikasi_pkey" PRIMARY KEY ("token");
