// Define la interfaz Invoice en un archivo separado
export interface Invoice {
  id: number;
  amount: number;
  customer: {
    cuit: string;
  } | null;
  product: {
    name: string;
  };
  // Añade otros campos que sean relevantes
}
