export interface Product {
  _id: string;
  nome: string;
  fabricante?: string;
  categoria?: string;
  certificacao?: string;
  classeAgronomica?: string;
  autorizadoPor?: string;
}
