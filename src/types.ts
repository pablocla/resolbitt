export interface Product {
  id: number;
  name: string;
  // Agregar otras propiedades relevantes de Product
}

export interface Invoice {
  id: number;
  amount: number;
  customerId?: number | null;
  cbteTipo?: number | null;
  ptoVta?: number | null;
  concepto?: number | null;
  docTipo?: number | null;
  docNro?: string | null;
  impNeto?: number | null;
  impIVA?: number | null;
  impTotal?: number | null;
  createdAt: Date;
  updatedAt: Date;
  products: {
    product: Product;
  }[];
}
