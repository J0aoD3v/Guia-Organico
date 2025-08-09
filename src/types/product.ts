export interface Product {
  _id: string;
  nome: string;
  fabricante?: string;
  categoria?: string;
  certificacao?: string;
  classeAgronomica?: string;
  autorizadoPor?: string;
  finalidade?: string;
  composicao?: string;
  modoUso?: string;
  precaucoes?: string;
  status?: string;
  origem?: string;
  criadoEm?: Date;
  criadoPor?: string;
  atualizadoEm?: Date;
}
