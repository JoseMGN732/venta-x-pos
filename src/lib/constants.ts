import { Product, User, Business, BusinessConfig } from '../types';

export const DEFAULT_BUSINESS_ID = 'business-1';

export const CATEGORIES = [
  'Alimentos',
  'Bebidas',
  'Limpieza',
  'Electrónicos',
  'Ropa',
  'Otros'
];

export const DEMO_BUSINESS: Business = {
  id: DEFAULT_BUSINESS_ID,
  nombre: 'Mi Tienda Demo',
  ruc: '20123456789',
  direccion: 'Av. Principal 123, Ciudad',
  telefono: '987654321',
  email: 'contacto@mitienda.com'
};

export const DEMO_CONFIG: BusinessConfig = {
  negocioId: DEFAULT_BUSINESS_ID,
  info: DEMO_BUSINESS,
  impuesto: 16,
  moneda: 'S/'
};

export const DEMO_USERS: User[] = [
  {
    id: 'user-admin',
    username: 'admin',
    password: 'admin123',
    nombre: 'Administrador Sistema',
    rol: 'Administrador',
    negocioId: DEFAULT_BUSINESS_ID
  },
  {
    id: 'user-cajero',
    username: 'cajero',
    password: 'cajero123',
    nombre: 'Cajero Principal',
    rol: 'Cajero',
    negocioId: DEFAULT_BUSINESS_ID
  }
];

export const DEMO_PRODUCTS: Product[] = [
  { id: 'p1', nombre: 'Arroz Extra 1kg', categoria: 'Alimentos', sku: 'AL001', precioCompra: 2.5, precioVenta: 3.8, stock: 50, negocioId: DEFAULT_BUSINESS_ID },
  { id: 'p2', nombre: 'Aceite Vegetal 1L', categoria: 'Alimentos', sku: 'AL002', precioCompra: 6.0, precioVenta: 8.5, stock: 4, negocioId: DEFAULT_BUSINESS_ID },
  { id: 'p3', nombre: 'Azúcar Rubia 1kg', categoria: 'Alimentos', sku: 'AL003', precioCompra: 2.8, precioVenta: 4.2, stock: 30, negocioId: DEFAULT_BUSINESS_ID },
  { id: 'p4', nombre: 'Leche Evaporada', categoria: 'Alimentos', sku: 'AL004', precioCompra: 3.2, precioVenta: 4.5, stock: 25, negocioId: DEFAULT_BUSINESS_ID },
  { id: 'p5', nombre: 'Café Molido 250g', categoria: 'Alimentos', sku: 'AL005', precioCompra: 12.0, precioVenta: 18.0, stock: 12, negocioId: DEFAULT_BUSINESS_ID },
  { id: 'p6', nombre: 'Agua Mineral 500ml', categoria: 'Bebidas', sku: 'BE001', precioCompra: 0.8, precioVenta: 1.5, stock: 60, negocioId: DEFAULT_BUSINESS_ID },
  { id: 'p7', nombre: 'Gaseosa Negra 1.5L', categoria: 'Bebidas', sku: 'BE002', precioCompra: 3.5, precioVenta: 5.5, stock: 3, negocioId: DEFAULT_BUSINESS_ID },
  { id: 'p8', nombre: 'Jugo de Naranja 1L', categoria: 'Bebidas', sku: 'BE003', precioCompra: 4.0, precioVenta: 6.5, stock: 15, negocioId: DEFAULT_BUSINESS_ID },
  { id: 'p9', nombre: 'Detergente en Polvo', categoria: 'Limpieza', sku: 'LI001', precioCompra: 5.5, precioVenta: 8.0, stock: 20, negocioId: DEFAULT_BUSINESS_ID },
  { id: 'p10', nombre: 'Lavandina 1L', categoria: 'Limpieza', sku: 'LI002', precioCompra: 2.0, precioVenta: 3.5, stock: 10, negocioId: DEFAULT_BUSINESS_ID },
  { id: 'p11', nombre: 'Trapo de Microfibra', categoria: 'Limpieza', sku: 'LI003', precioCompra: 1.5, precioVenta: 3.0, stock: 5, negocioId: DEFAULT_BUSINESS_ID },
  { id: 'p12', nombre: 'Cable USB-C 1m', categoria: 'Electrónicos', sku: 'EL001', precioCompra: 8.0, precioVenta: 15.0, stock: 12, negocioId: DEFAULT_BUSINESS_ID },
  { id: 'p13', nombre: 'Batería AA x4', categoria: 'Electrónicos', sku: 'EL002', precioCompra: 10.0, precioVenta: 18.0, stock: 8, negocioId: DEFAULT_BUSINESS_ID },
  { id: 'p14', nombre: 'Audífonos Básicos', categoria: 'Electrónicos', sku: 'EL003', precioCompra: 15.0, precioVenta: 25.0, stock: 2, negocioId: DEFAULT_BUSINESS_ID },
  { id: 'p15', nombre: 'Camiseta Algodón M', categoria: 'Ropa', sku: 'RO001', precioCompra: 20.0, precioVenta: 35.0, stock: 10, negocioId: DEFAULT_BUSINESS_ID },
  { id: 'p16', nombre: 'Gorra Deportiva', categoria: 'Ropa', sku: 'RO002', precioCompra: 12.0, precioVenta: 22.0, stock: 7, negocioId: DEFAULT_BUSINESS_ID },
  { id: 'p17', nombre: 'Mochila Urbana', categoria: 'Ropa', sku: 'RO003', precioCompra: 45.0, precioVenta: 75.0, stock: 4, negocioId: DEFAULT_BUSINESS_ID },
];
