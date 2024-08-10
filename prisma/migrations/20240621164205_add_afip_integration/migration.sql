/*
  Warnings:

  - Added the required column `cuit` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `afipStatusId` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "cuit" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "afipStatusId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "AfipStatus" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "AfipStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AfipResponse" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AfipResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_afipStatusId_fkey" FOREIGN KEY ("afipStatusId") REFERENCES "AfipStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AfipResponse" ADD CONSTRAINT "AfipResponse_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
