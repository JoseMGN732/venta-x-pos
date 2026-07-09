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
import { Sale } from '../types';

const DashboardPage = () => {
  const { data } = useBusiness();
  const { user } = useAuth();
  const isAdmin = user?.rol?.toUpperCase() === 'ADMINISTRADOR';

  const totalProducts = data.products.length;
  const lowStockProducts = data.products.filter(p => p.stock <= 5).length;
  
  const today = new Date().toISOString().split('T')[0];
  const salesToday = data.sales.filter(s => s.fecha === today);
  const totalSalesToday = salesToday.reduce((acc, s) => acc + s.total, 0);
  
  const currentMonth = today.substring(0, 7);
  const salesMonth = data.sales.filter(s => s.fecha.startsWith(currentMonth));
  const totalSalesMonth = salesMonth.reduce((acc, s) => acc + s.total, 0);

  // Total de tickets realizados hoy
  const totalTicketsToday = salesToday.length;

  // Ganancia del mes (por ahora igual a ventas)
  const totalProfitMonth = totalSalesMonth;

  // ===== Ventas últimos 7 días =====
  const salesLast7Days = [];

  // ===== Top 5 productos más vendidos =====
  const topProducts = data.products
    .map(product => {

        let vendidos = 0;

        data.sales.forEach(sale => {
            sale.items.forEach(item => {
                if (item.productoId === product.id) {
                    vendidos += item.cantidad;
                }
            });
        });

        return {
            ...product,
            vendidos
        };

    })
    .filter(product => product.vendidos > 0)
    .sort((a,b)=>b.vendidos-a.vendidos)
    .slice(0,5);

  const criticalStock = data.products
    .filter(product => product.stock <= 5)
    .sort((a,b)=>a.stock-b.stock);

  const getCantidadArticulos = (sale: Sale) =>
    sale.items.reduce(
        (acc, item) => acc + item.cantidad,
        0
    );

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const day = date.toISOString().split("T")[0];

    const total = data.sales
      .filter(sale => sale.fecha === day)
      .reduce((sum, sale) => sum + sale.total, 0);

    salesLast7Days.push({
      label: date.toLocaleDateString("es-MX", {
        weekday: "short"
      }),
      total
    });
  }

  const maxSale = Math.max(
    ...salesLast7Days.map(day => day.total),
    1
  );

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
    {
      title: 'Tickets Hoy',
      value: totalTicketsToday,
      icon: ShoppingCart,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
    {
      title: 'Ganancia Mes',
      value: `${data.config.moneda} ${totalProfitMonth.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
  ];

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Bienvenido, {user?.nombre}</h1>
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

      <div className="mt-3 flex flex-wrap gap-6 text-sm text-slate-600">

          <span>
              <strong>Productos:</strong> {data.products.length}
          </span>

          <span>
              <strong>Ventas:</strong> {data.sales.length}
          </span>

          <span>
              <strong>Usuarios:</strong> {data.users.length}
          </span>

          <span>
              <strong>Negocio:</strong> {data.config.info.nombre}
          </span>

      </div>

      <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-6">
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tendencia de Ventas (Últimos 7 días)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-end justify-between gap-2 px-6">
            {/* Simple SVG Chart simulation */}
            {salesLast7Days.map((day, i) => {

              const height = (day.total / maxSale) * 100;

              return (

                <div
                  key={i}
                  className="flex flex-col items-center gap-2 flex-1"
                >

                  <div
                    className="w-full bg-blue-600 rounded-t-md transition-all hover:bg-blue-700"
                    style={{
                      height: `${height}%`,
                      minHeight: "6px"
                    }}
                  />

                  <span className="text-[10px] text-slate-500">
                    {day.label}
                  </span>

                </div>

              );

            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.sales.slice(-5).reverse().map((sale) => (
                <div key={sale.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{getCantidadArticulos(sale)} artículos</span>
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
        <Card>
            <CardHeader>
                <CardTitle>Productos más vendidos</CardTitle>
            </CardHeader>

            <CardContent>

                {topProducts.map((product, index) => (

                    <div
                        key={product.id}
                        className="flex justify-between border-b py-2 last:border-0"
                    >

                        <div>

                            <span className="font-medium">
                                {index + 1}. {product.nombre}
                            </span>

                        </div>

                        <span className="text-sm font-semibold text-blue-600">
                          {product.vendidos} vendidos
                        </span>

                    </div>

                ))}

                {topProducts.length === 0 && (

                    <p className="text-center text-slate-500">

                        Sin ventas registradas

                    </p>

                )}

            </CardContent>

        </Card>
        <Card>

          <CardHeader>

          <CardTitle>

          Stock crítico

          </CardTitle>

          </CardHeader>

          <CardContent>

          {criticalStock.map(product=>(

          <div
          key={product.id}
          className="flex justify-between border-b py-2 last:border-0"
          >

          <span>

          {product.nombre}

          </span>

          <span
            className={`font-bold ${
                product.stock === 0
                    ? "text-red-700"
                    : "text-red-500"
            }`}
        >
            {product.stock === 0
                ? "AGOTADO"
                : `${product.stock} unidades`}
          </span>

          </div>

          ))}

          {criticalStock.length===0 && (

          <p className="text-slate-500">

          Todo el inventario está correcto.

          </p>

          )}

          </CardContent>

        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
