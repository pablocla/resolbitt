import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { generateInvoicePdf } from "../../utils/generateInvoicePdf";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST" && req.query.action === "generate-pdf") {
    const { invoiceId } = req.body;

    if (!invoiceId) {
      return res
        .status(400)
        .json({ error: "Missing invoiceId in request body" });
    }

    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
          customer: true,
          product: true,
        },
      });

      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }

      const pdfBytes = await generateInvoicePdf({
        customer: invoice.customer,
        product: invoice.product,
        amount: invoice.amount,
        impIVA: invoice.impIVA,
        impTotal: invoice.impTotal,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice_${invoiceId}.pdf`
      );
      return res.status(200).send(pdfBytes);
    } catch (error) {
      console.error("Error generating invoice PDF:", error);
      return res.status(500).json({ error: "Error generating invoice PDF" });
    }
  } else if (req.method === "POST") {
    const {
      amount,
      productId,
      customerId,
      cbteTipo,
      ptoVta,
      concepto,
      docTipo,
      docNro,
      impNeto,
      impIVA,
    } = req.body;

    if (
      amount === undefined ||
      productId === undefined ||
      customerId === undefined ||
      cbteTipo === undefined ||
      ptoVta === undefined ||
      concepto === undefined ||
      docTipo === undefined ||
      docNro === undefined ||
      impNeto === undefined ||
      impIVA === undefined
    ) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios y no pueden ser nulos",
      });
    }

    try {
      const invoice = await prisma.invoice.create({
        data: {
          amount,
          productId,
          customerId,
          cbteTipo,
          ptoVta,
          concepto,
          docTipo,
          docNro,
          impNeto,
          impIVA,
          impTotal: amount + impIVA,
        },
      });

      return res.status(201).json(invoice);
    } catch (error) {
      console.error("Error creating invoice:", error);
      return res.status(500).json({ error: "Error creating invoice" });
    }
  } else if (req.method === "GET") {
    try {
      const invoices = await prisma.invoice.findMany({
        include: {
          product: true,
          customer: true,
        },
      });
      return res.status(200).json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return res.status(500).json({ error: "Error fetching invoices" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
