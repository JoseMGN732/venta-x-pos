import { Product, User, Business, BusinessConfig } from "../types";

export const DEFAULT_BUSINESS_ID = 1;

export const CATEGORIES = [
  "Alimentos",
  "Bebidas",
  "Limpieza",
  "Electrónicos",
  "Ropa",
  "Otros"
];

export const DEMO_BUSINESS: Business = {
  id: 1,
  nombre: "",
  ruc: "",
  direccion: "",
  telefono: "",
  email: ""
};

export const DEMO_CONFIG: BusinessConfig = {
  negocioId: 1,
  info: DEMO_BUSINESS,
  impuesto: 16,
  moneda: "$"
};

export const DEMO_USERS: User[] = [];

export const DEMO_PRODUCTS: Product[] = [];