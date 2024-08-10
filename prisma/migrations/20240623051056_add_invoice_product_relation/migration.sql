/*
  Warnings:

  - You are about to drop the column `productId` on the `Invoice` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_productId_fkey";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "productId";

-- CreateTable
CREATE TABLE "InvoiceProduct" (
    "invoiceId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "InvoiceProduct_pkey" PRIMARY KEY ("invoiceId","productId")
);

-- AddForeignKey
ALTER TABLE "InvoiceProduct" ADD CONSTRAINT "InvoiceProduct_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceProduct" ADD CONSTRAINT "InvoiceProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
