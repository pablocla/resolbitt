export interface Product {
  id: number;
  name: string;
  price: number;
  // ...otros campos
}

export interface InvoiceProduct {
  productId: number;
  quantity: number;
}

export interface InvoiceCreate {
  customerId: number;
  products: InvoiceProduct[];
  amount: number;
  cbteTipo?: number;
  ptoVta?: number;
  concepto?: number;
  docTipo?: number;
  docNro?: string;
  impNeto?: number;
  impIVA?: number;
  impTotal?: number;
}

export interface Invoice {
  id: number;
  customerId: number;
  amount: number;
  products: InvoiceProduct[];
  // ...otros campos
}
