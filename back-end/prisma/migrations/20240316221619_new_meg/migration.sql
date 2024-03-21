/*
  Warnings:

  - The values [AWAY] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[title]` on the table `channels` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Character" AS ENUM ('Aurora', 'Luna', 'Lumina', 'Nova', 'Starlight', 'Aegon');

-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('ONLINE', 'OFFLINE', 'INGAME');
ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'ONLINE';
COMMIT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "character" "Character" DEFAULT 'Aurora';

-- DropTable
DROP TABLE "User";

-- CreateIndex
CREATE UNIQUE INDEX "channels_title_key" ON "channels"("title");
