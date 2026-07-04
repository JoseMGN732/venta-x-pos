import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';
import MovementsPage from './pages/MovementsPage';
import POSPage from './pages/POSPage';
import SalesPage from './pages/SalesPage';
import UsersPage from './pages/UsersPage';
import BusinessesPage from './pages/BusinessesPage';
import SettingsPage from './pages/SettingsPage';
import StockPage from './pages/StockPage';
import { useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) => {
  const { user, loading } = useAuth();

  // 🔥 IMPORTANTE: esperar a que cargue localStorage
  if (loading) {
    return <div>Cargando...</div>;
  }

  // ❌ si no hay usuario
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 validación de roles
  if (roles && !roles.includes(user.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        <Route path="dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="productos" element={
          <ProtectedRoute roles={['ADMINISTRADOR']}>
            <ProductsPage />
          </ProtectedRoute>
        } />
        
        <Route path="inventario" element={
          <ProtectedRoute roles={['ADMINISTRADOR']}>
            <InventoryPage />
          </ProtectedRoute>
        } />
        
        <Route path="movimientos" element={
          <ProtectedRoute roles={['ADMINISTRADOR']}>
            <MovementsPage />
          </ProtectedRoute>
        } />
        
        <Route path="ventas" element={
          <ProtectedRoute roles={['ADMINISTRADOR']}>
            <SalesPage />
          </ProtectedRoute>
        } />
        
        <Route path="punto-de-venta" element={
          <ProtectedRoute>
            <POSPage />
          </ProtectedRoute>
        } />
        
        <Route path="usuarios" element={
          <ProtectedRoute roles={['ADMINISTRADOR']}>
            <UsersPage />
          </ProtectedRoute>
        } />
        
        <Route path="negocios" element={
          <ProtectedRoute roles={['ADMINISTRADOR']}>
            <BusinessesPage />
          </ProtectedRoute>
        } />
        
        <Route path="configuracion" element={
          <ProtectedRoute roles={['ADMINISTRADOR']}>
            <SettingsPage />
          </ProtectedRoute>
        } />
        
        <Route path="stock" element={
          <ProtectedRoute>
            <StockPage />
          </ProtectedRoute>
        } />
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
