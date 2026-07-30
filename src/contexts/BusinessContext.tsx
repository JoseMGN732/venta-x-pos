import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { BusinessData, Product, Sale, StockMovement, User, BusinessConfig } from '../types';
import { getBusinessData, saveBusinessData } from '../lib/storage';
import { DEFAULT_BUSINESS_ID } from '../lib/constants';
import { getProducts } from "../services/productService";
import { getBusiness } from "../services/businessService";

interface BusinessContextType {
  currentBusinessId: string;
  data: BusinessData;
  updateProducts: (products: Product[]) => void;
  updateSales: (sales: Sale[]) => void;
  updateMovements: (movements: StockMovement[]) => void;
  updateUsers: (users: User[]) => void;
  updateConfig: (config: BusinessConfig) => void;
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

  useEffect(() => {

    const loadBusiness = async () => {

      const savedUser = localStorage.getItem("user");

      if (!savedUser) return;


      const usuario = JSON.parse(savedUser);


      const response = await getBusiness(usuario.negocioId);


      if(response.success){

        setData(prev => ({
          ...prev,

          config:{
            ...prev.config,

            info:{
              ...prev.config.info,

              nombre: response.business.nombre_negocio,
              telefono: response.business.telefono,
              email: response.business.correo

            }

          }

        }));

      }

    };


    loadBusiness();


  }, [currentBusinessId]);

  useEffect(() => {

    const updateBusiness = () => {

      const savedUser = localStorage.getItem("user");

      if(savedUser){

        const parsed = JSON.parse(savedUser);

        setCurrentBusinessId(parsed.negocioId);

        const businessData = getBusinessData(
          parsed.negocioId
        );

        setData(businessData);

      }

    };


    updateBusiness();


    window.addEventListener(
      "userChanged",
      updateBusiness
    );


    return () => {

      window.removeEventListener(
        "userChanged",
        updateBusiness
      );

    };


  }, []);

  useEffect(() => {

    const loadProducts = async () => {

      try {

        const response = await getProducts();

        const savedUser = localStorage.getItem("user");

        if (!savedUser) return;

        const usuario = JSON.parse(savedUser);

        const productosFiltrados = response.products.filter(
          (p: Product) => Number(p.negocioId) === Number(usuario.negocioId)
        );

        setData(prev => ({
          ...prev,
          products: productosFiltrados
        }));

      } catch (error) {

        console.error("Error cargando productos", error);

      }

    };

    loadProducts();

  }, []);

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
    updateProducts,
    updateSales,
    updateMovements,
    updateUsers,
    updateConfig
}), [currentBusinessId, data]);

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
