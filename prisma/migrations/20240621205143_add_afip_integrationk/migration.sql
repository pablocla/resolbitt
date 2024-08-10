/*
  Warnings:

  - Made the column `userId` on table `Invoice` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_afipStatusId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_userId_fkey";

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "afipStatusId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_afipStatusId_fkey" FOREIGN KEY ("afipStatusId") REFERENCES "AfipStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
