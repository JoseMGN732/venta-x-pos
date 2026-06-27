import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { BusinessData, Product, Sale, StockMovement, User, BusinessConfig } from '../types';
import { getBusinessData, saveBusinessData, getAllBusinesses } from '../lib/storage';
import { DEFAULT_BUSINESS_ID } from '../lib/constants';

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
    return localStorage.getItem('current_business_id') || DEFAULT_BUSINESS_ID;
  });

  const [data, setData] = useState<BusinessData>(() => getBusinessData(currentBusinessId));
  const [allBusinessIds, setAllBusinessIds] = useState<string[]>(() => getAllBusinesses());

  useEffect(() => {
    localStorage.setItem('current_business_id', currentBusinessId);
    setData(getBusinessData(currentBusinessId));
  }, [currentBusinessId]);

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
