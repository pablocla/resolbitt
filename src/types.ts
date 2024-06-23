// src/types.ts
export interface Product {
  id: number;
  name: string;
}

export interface InvoiceProduct {
  product: Product;
}

export interface Invoice {
  id: number;
  amount: number;
  cbteTipo: number;
  ptoVta: number;
  concepto: number;
  docTipo: number;
  docNro: string;
  impNeto: number;
  impIVA: number;
  impTotal: number;
  customerId: number | null;
  products: InvoiceProduct[];
  createdAt: string;
  userId: number | null;
  afipStatusId: number | null;
  updatedAt: Date;
}
