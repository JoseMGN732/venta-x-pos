import { useBusiness } from '../contexts/BusinessContext';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Search, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { Product } from "../types";

const InventoryPage = () => {
  const { data } = useBusiness();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {

      const response = await getProducts();

      setProducts(response.products);

  };

  const lowStockItems = products.filter(p => p.stock <= 5);
  
  const filteredProducts = products.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Estado de Inventario</h1>
        <p className="text-slate-500">Monitoreo de niveles de stock y alertas de reposición.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-red-100 bg-red-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Alertas de Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">{lowStockItems.length}</div>
            <p className="text-xs text-red-500 mt-1">Productos con 5 unidades o menos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-green-600" /> Valor Total Inventario (Costo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data.config.moneda} {products.reduce((acc, p) => acc + (p.precioCompra * p.stock), 0).toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Basado en precio de compra</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <ArrowDownRight className="h-4 w-4 text-blue-600" /> Valor Estimado Venta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data.config.moneda} {products.reduce((acc, p) => acc + (p.precioVenta * p.stock), 0).toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Potencial de ingresos total</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Filtrar inventario..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock Actual</TableHead>
                <TableHead>Precio Compra</TableHead>
                <TableHead>Precio Venta</TableHead>
                <TableHead>Margen</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const margin = product.precioVenta - product.precioCompra;
                const marginPercent = (margin / product.precioVenta) * 100;
                
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.nombre}</TableCell>
                    <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                    <TableCell className="font-bold">{product.stock}</TableCell>
                    <TableCell>{data.config.moneda} {product.precioCompra.toFixed(2)}</TableCell>
                    <TableCell>{data.config.moneda} {product.precioVenta.toFixed(2)}</TableCell>
                    <TableCell className="text-green-600">
                      {marginPercent.toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      {product.stock <= 5 ? (
                        <Badge variant="destructive" className="animate-pulse">Stock Bajo</Badge>
                      ) : product.stock === 0 ? (
                        <Badge variant="destructive">Agotado</Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Normal</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
