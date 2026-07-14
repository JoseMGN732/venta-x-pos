import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { BusinessData, Product, Sale, StockMovement, User, BusinessConfig } from '../types';
import { getBusinessData, saveBusinessData, getAllBusinesses } from '../lib/storage';
import { DEFAULT_BUSINESS_ID } from '../lib/constants';
import { getProducts } from "../services/productService";

interface BusinessContextType {
  currentBusinessId: string;
  data: BusinessData;
  switchBusiness: (id: string) => void;
  updateProducts: (products: Product[]) => void;
  updateSales: (sales: Sale[]) => void;
  updateMovements: (movements: StockMovement[]) => void;
  updateUsers: (users: User[]) => void;
  updateConfig: (config: BusinessConfig) => void;
  allBusinessIds: string[];
  refreshBusinessList: () => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBusinessId, setCurrentBusinessId] = useState<string>(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.negocioId || DEFAULT_BUSINESS_ID;
    }

    return DEFAULT_BUSINESS_ID;
  });

  const [data, setData] = useState<BusinessData>(() => getBusinessData(currentBusinessId));
  const [allBusinessIds, setAllBusinessIds] = useState<string[]>(() => getAllBusinesses());

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsed = JSON.parse(user);
      if (parsed.negocioId) {
        setCurrentBusinessId(parsed.negocioId);
      }
    }
  }, []);

  useEffect(() => {

    const loadProducts = async () => {

      try {

        const response = await getProducts();

        setData(prev => ({
          ...prev,
          products: response.products
        }));

      } catch (error) {

        console.error("Error cargando productos", error);

      }

    };

    loadProducts();

  }, []);
  
  const switchBusiness = (id: string) => {
    setCurrentBusinessId(id);
  };

  const refreshBusinessList = () => {
    setAllBusinessIds(getAllBusinesses());
  };

  const updateProducts = (products: Product[]) => {
    const newData = { ...data, products };
    setData(newData);
    saveBusinessData(currentBusinessId, newData);
  };

  const updateSales = (sales: Sale[]) => {
    const newData = { ...data, sales };
    setData(newData);
    saveBusinessData(currentBusinessId, newData);
  };

  const updateMovements = (movements: StockMovement[]) => {
    const newData = { ...data, movements };
    setData(newData);
    saveBusinessData(currentBusinessId, newData);
  };

  const updateUsers = (users: User[]) => {
    const newData = { ...data, users };
    setData(newData);
    saveBusinessData(currentBusinessId, newData);
  };

  const updateConfig = (config: BusinessConfig) => {
    const newData = { ...data, config };
    setData(newData);
    saveBusinessData(currentBusinessId, newData);
  };

  const value = useMemo(() => ({
    currentBusinessId,
    data,
    switchBusiness,
    updateProducts,
    updateSales,
    updateMovements,
    updateUsers,
    updateConfig,
    allBusinessIds,
    refreshBusinessList
  }), [currentBusinessId, data, allBusinessIds]);

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
