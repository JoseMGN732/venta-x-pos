export type Role = "ADMINISTRADOR" | "CAJERO";

export interface User {
  id: number;
  username: string;
  password?: string;
  nombre: string;
  rol: Role;
  negocioId: number;
  activo: number;
}

export interface Product {
  id: string;
  negocioId: string;
  nombre: string;
  categoria: string;
  sku: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  imagen?: string;
}

export interface SaleItem {
  productId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  fecha: string;
  hora: string;
  negocioId: number;
  items: SaleItem[];
  subtotal: number;
  impuesto: number;
  total: number;
  metodoPago: string;
  cajero: string;
}

export interface StockMovement {
  id: string;
  negocioId: string;
  productoId: string;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  motivo: string;
  fecha: string;
  usuario: string;
}

export interface Business {
  id: string;
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  email: string;
}

export interface BusinessConfig {
  negocioId: string;
  info: Business;
  impuesto: number;
  moneda: string;

  branding?: {
  colorPrimario: string;
  colorSecundario: string;
  tipografia: string;
  logo: string;
};
}

export interface BusinessData {
  products: Product[];
  users: User[];
  sales: Sale[];
  movements: StockMovement[];
  config: BusinessConfig;
}
