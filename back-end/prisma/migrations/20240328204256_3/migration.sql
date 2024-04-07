-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "loserId" TEXT;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
