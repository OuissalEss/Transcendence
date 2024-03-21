-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_winnerId_fkey";

-- DropIndex
DROP INDEX "friends_isAccepted_key";

-- DropIndex
DROP INDEX "friends_receiverId_key";

-- DropIndex
DROP INDEX "friends_senderId_key";

-- AlterTable
ALTER TABLE "matches" ALTER COLUMN "winnerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
