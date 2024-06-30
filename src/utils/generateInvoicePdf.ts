import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs";
import path from "path";

interface InvoiceDetails {
  customer: {
    name: string;
    email: string;
  };
  product: {
    name: string;
  };
  amount: number;
  impIVA: number;
  impTotal: number;
}

export async function generateInvoicePdf(invoiceDetails: InvoiceDetails) {
  const { customer, product, amount, impIVA, impTotal } = invoiceDetails;

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.addPage([600, 400]);
  const { width, height } = page.getSize();

  // Embedding the font
  const fontPath = path.resolve("./public/fonts/Roboto-Regular.ttf");
  if (!fs.existsSync(fontPath)) {
    throw new Error("Font file not found");
  }
  const fontBytes = fs.readFileSync(fontPath);
  const font = await pdfDoc.embedFont(fontBytes);

  // Embedding the logo
  const logoPath = path.resolve("./public/logo.png");
  if (!fs.existsSync(logoPath)) {
    throw new Error("Logo file not found");
  }
  const logoBytes = fs.readFileSync(logoPath);
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoDims = logoImage.scale(0.2);

  // Drawing the logo
  page.drawImage(logoImage, {
    x: width - logoDims.width - 50,
    y: height - logoDims.height - 10,
    width: logoDims.width,
    height: logoDims.height,
  });

  const fontSize = 12;

  // Adding text
  page.drawText("Factura", {
    x: 50,
    y: height - 50,
    size: 30,
    font,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Cliente: ${customer.name}`, {
    x: 50,
    y: height - 80,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Email: ${customer.email}`, {
    x: 50,
    y: height - 100,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Producto: ${product.name}`, {
    x: 50,
    y: height - 120,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Monto: $${amount.toFixed(2)}`, {
    x: 50,
    y: height - 140,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  page.drawText(`IVA: $${impIVA.toFixed(2)}`, {
    x: 50,
    y: height - 160,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Total: $${impTotal.toFixed(2)}`, {
    x: 50,
    y: height - 180,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
