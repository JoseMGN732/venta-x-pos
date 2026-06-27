import React from 'react';
import { useBusiness } from '../contexts/BusinessContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Package, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp,
  ShoppingCart,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const DashboardPage = () => {
  const { data } = useBusiness();
  const { role } = useAuth();
  const isAdmin = role === 'Administrador';

  const totalProducts = data.products.length;
  const lowStockProducts = data.products.filter(p => p.stock <= 5).length;
  
  const today = new Date().toISOString().split('T')[0];
  const salesToday = data.sales.filter(s => s.fecha === today);
  const totalSalesToday = salesToday.reduce((acc, s) => acc + s.total, 0);
  
  const currentMonth = today.substring(0, 7);
  const salesMonth = data.sales.filter(s => s.fecha.startsWith(currentMonth));
  const totalSalesMonth = salesMonth.reduce((acc, s) => acc + s.total, 0);

  const stats = [
    {
      title: 'Total Productos',
      value: totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Stock Bajo',
      value: lowStockProducts,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      title: 'Ventas Hoy',
      value: `${data.config.moneda} ${totalSalesToday.toFixed(2)}`,
      icon: ShoppingCart,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: 'Ingresos Mes',
      value: `${data.config.moneda} ${totalSalesMonth.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
  ];

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Bienvenido, {role}</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-md transition-shadow border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Punto de Venta</CardTitle>
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-4">Realice nuevas ventas y genere tickets para los clientes.</p>
              <Button asChild className="w-full bg-blue-600">
                <Link to="/punto-de-venta">Ir al POS <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Consultar Stock</CardTitle>
              <Package className="h-6 w-6 text-slate-600" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-4">Verifique la disponibilidad de productos rápidamente.</p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/stock">Ver Inventario</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard de Control</h1>
        <p className="text-slate-500">Resumen de operaciones de {data.config.info.nombre}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
              <div className={`${stat.bg} p-2 rounded-full`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Tendencia de Ventas (Últimos 7 días)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-end justify-between gap-2 px-6">
            {/* Simple SVG Chart simulation */}
            {[40, 65, 30, 85, 55, 90, 75].map((height, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div 
                  className="w-full bg-blue-500 rounded-t-md transition-all hover:bg-blue-600" 
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-[10px] text-slate-500">Día {i+1}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.sales.slice(-5).reverse().map((sale) => (
                <div key={sale.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{sale.items.length} productos</span>
                    <span className="text-xs text-slate-500">{sale.fecha} {sale.hora}</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {data.config.moneda} {sale.total.toFixed(2)}
                  </span>
                </div>
              ))}
              {data.sales.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No hay ventas registradas hoy.</p>
              )}
            </div>
            {data.sales.length > 0 && (
              <Button asChild variant="link" className="w-full mt-4 text-blue-600">
                <Link to="/ventas">Ver todas las ventas</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
