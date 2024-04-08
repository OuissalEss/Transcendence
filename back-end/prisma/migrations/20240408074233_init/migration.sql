/*
  Warnings:

  - A unique constraint covering the columns `[senderId]` on the table `friends` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[receiverId]` on the table `friends` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,channelId]` on the table `muted` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "friends_senderId_key" ON "friends"("senderId");

-- CreateIndex
CREATE UNIQUE INDEX "friends_receiverId_key" ON "friends"("receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "muted_userId_channelId_key" ON "muted"("userId", "channelId");
