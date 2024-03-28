/*
  Warnings:

  - Made the column `achievement` on table `user_achievements` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_achievements" ALTER COLUMN "achievement" SET NOT NULL;
