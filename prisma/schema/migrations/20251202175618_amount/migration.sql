/*
  Warnings:

  - You are about to drop the column `fee` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `reviewId` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_reviewId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "fee",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "reviewId";

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
