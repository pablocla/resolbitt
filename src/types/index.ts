export interface Invoice {
  id: string;
  amount: number;
  customerId: string | null;
  products: Array<{
    id: string;
    product: {
      id: string;
      name: string;
    };
    quantity: number;
  }>;
  cbteTipo: number | null;
  ptoVta: number | null;
  concepto: number | null;
  docTipo: number | null;
  docNro: string | null;
  impNeto: number | null;
  impIVA: number | null;
  impTotal: number | null;
  createdAt: Date;
  updatedAt: Date;
}
