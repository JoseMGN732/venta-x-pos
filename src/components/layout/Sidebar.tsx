import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Package,
  BarChart3,
  ArrowLeftRight,
  ShoppingCart,
  Users,
  Building2,
  Settings,
  Search,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.rol === "ADMINISTRADOR";

  const adminItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Productos', path: '/productos', icon: Package },
    { name: 'Inventario', path: '/inventario', icon: BarChart3 },
    { name: 'Movimientos', path: '/movimientos', icon: ArrowLeftRight },
    { name: 'Ventas', path: '/ventas', icon: ShoppingCart },
    { name: 'Usuarios', path: '/usuarios', icon: Users },
    { name: 'Negocios', path: '/negocios', icon: Building2 },
    { name: 'Configuración', path: '/configuracion', icon: Settings },
  ];

  const cashierItems = [
    { name: 'Punto de Venta', path: '/punto-de-venta', icon: ShoppingCart },
    { name: 'Consultar Stock', path: '/stock', icon: Search },
  ];

  const items = isAdmin ? adminItems : cashierItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-slate-50">

      <div className="flex h-16 items-center border-b px-6">
        <span className="text-xl font-bold text-blue-600">
          Venta X
        </span>
      </div>

      <div className="px-6 py-3 border-b">
        <p className="text-sm font-semibold">
          {user?.nombre}
        </p>

        <p className="text-xs text-slate-500">
          {user?.rol}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">

          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}

        </nav>
      </div>

      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </button>
      </div>

    </div>
  );
};

export default Sidebar;