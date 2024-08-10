/*
  Warnings:

  - The primary key for the `InvoiceProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "InvoiceProduct" DROP CONSTRAINT "InvoiceProduct_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "InvoiceProduct_pkey" PRIMARY KEY ("id");
