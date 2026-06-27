import { BusinessData, BusinessConfig, Product, User, Sale, StockMovement } from '../types';
import { DEMO_PRODUCTS, DEMO_USERS, DEMO_CONFIG, DEFAULT_BUSINESS_ID } from './constants';

const STORAGE_KEY_PREFIX = 'commercial_manager_';

export const getBusinessData = (businessId: string): BusinessData => {
  const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${businessId}`);
  if (data) {
    return JSON.parse(data);
  }

  // Initialize with demo data if it's the default business
  if (businessId === DEFAULT_BUSINESS_ID) {
    const initialData: BusinessData = {
      products: DEMO_PRODUCTS,
      users: DEMO_USERS,
      sales: [],
      movements: [],
      config: DEMO_CONFIG
    };
    saveBusinessData(businessId, initialData);
    return initialData;
  }

  // Return empty structure for new business
  return {
    products: [],
    users: [],
    sales: [],
    movements: [],
    config: {
      negocioId: businessId,
      info: { id: businessId, nombre: 'Nuevo Negocio', ruc: '', direccion: '', telefono: '', email: '' },
      impuesto: 16,
      moneda: 'S/'
    }
  };
};

export const saveBusinessData = (businessId: string, data: BusinessData) => {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${businessId}`, JSON.stringify(data));
};

export const getAllBusinesses = (): string[] => {
  const keys = Object.keys(localStorage);
  const businessIds = keys
    .filter(k => k.startsWith(STORAGE_KEY_PREFIX))
    .map(k => k.replace(STORAGE_KEY_PREFIX, ''));
  
  if (businessIds.length === 0) return [DEFAULT_BUSINESS_ID];
  return businessIds;
};

export const deleteBusiness = (businessId: string) => {
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${businessId}`);
};
