import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { generateInvoicePdf } from "../../utils/generateInvoicePdf";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    if (req.query.action === "generate-pdf") {
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
            products: {
              include: {
                product: true,
              },
            },
          },
        });

        if (!invoice) {
          return res.status(404).json({ error: "Invoice not found" });
        }

        const customerData = invoice.customer
          ? { name: invoice.customer.name, email: invoice.customer.email ?? "" }
          : { name: "Desconocido", email: "" };

        const pdfBytes = await generateInvoicePdf({
          customer: customerData,
          products: invoice.products.map((ip) => ip.product), // Cambio aquí de 'product' a 'products'
          amount: invoice.amount,
          impIVA: invoice.impIVA ?? 0, // Asignar valor por defecto si es null
          impTotal: invoice.impTotal ?? 0, // Asignar valor por defecto si es null
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
    } else {
      const {
        amount,
        productIds,
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
        productIds === undefined ||
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
            customerId,
            cbteTipo,
            ptoVta,
            concepto,
            docTipo,
            docNro,
            impNeto,
            impIVA,
            impTotal: amount + impIVA,
            products: {
              create: productIds.map((productId: number) => ({
                product: {
                  connect: { id: productId },
                },
                quantity: 1, // Ajusta esto según tus necesidades
              })),
            },
          },
        });

        // Enviar respuesta de éxito al POS
        return res.status(201).json(invoice);
      } catch (error) {
        console.error("Error creating invoice:", error);
        return res.status(500).json({ error: "Error creating invoice" });
      }
    }
  } else if (req.method === "GET") {
    try {
      const invoices = await prisma.invoice.findMany({
        include: {
          products: {
            include: {
              product: true,
            },
          },
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
