/*
  Warnings:

  - You are about to drop the column `amount` on the `Event` table. All the data in the column will be lost.
  - Added the required column `fee` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "amount",
ADD COLUMN     "fee" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "Carousel" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Carousel_pkey" PRIMARY KEY ("id")
);
