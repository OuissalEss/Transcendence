/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `channels` will be added. If there are existing duplicate values, this will fail.
  - Made the column `text` on table `messages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "NotifType" ADD VALUE 'MATCH';

-- AlterTable
ALTER TABLE "channels" ADD COLUMN     "description" TEXT,
ADD COLUMN     "profileImage" TEXT;

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "text" SET NOT NULL;

-- CreateTable
CREATE TABLE "banned" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "banned_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "muted" (
    "id" TEXT NOT NULL,
    "duration" TIMESTAMP(3),
    "finished" BOOLEAN NOT NULL DEFAULT true,
    "permanent" BOOLEAN NOT NULL DEFAULT false,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "muted_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "muted_userId_channelId_key" ON "muted"("userId", "channelId");

-- CreateIndex
CREATE UNIQUE INDEX "channels_title_key" ON "channels"("title");

-- AddForeignKey
ALTER TABLE "banned" ADD CONSTRAINT "banned_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banned" ADD CONSTRAINT "banned_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "muted" ADD CONSTRAINT "muted_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "muted" ADD CONSTRAINT "muted_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
