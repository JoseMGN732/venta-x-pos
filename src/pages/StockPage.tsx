import React, { useEffect, useState } from 'react';
import { useBusiness } from '../contexts/BusinessContext';
import { Input } from '../components/ui/input';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Search, Package, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getProducts } from "../services/productService";

const StockPage = () => {
  const { data } = useBusiness();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [products,setProducts] = useState<Product[]>([]);

  useEffect(() => {

    if (!user?.negocioId) return;

    loadProducts();

  }, [user?.negocioId]);

  const loadProducts = async () => {

    try {

        const response = await getProducts();

        if(response.success){

            const productosFiltrados = response.products.filter(
                (p: Product) =>
                    Number(p.negocioId) === Number(user?.negocioId)
            );

            setProducts(productosFiltrados);

        }

    } catch(error){

        console.error(
          "Error cargando inventario",
          error
        );

    }

};  

  const filteredProducts = products.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Consulta de Stock</h1>
          <p className="text-slate-500">Verifique rápidamente la disponibilidad de productos.</p>
        </div>
        <Button asChild className="bg-blue-600">
          <Link to="/punto-de-venta">
            <ShoppingCart className="mr-2 h-4 w-4" /> Ir a Vender
          </Link>
        </Button>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <Input 
          placeholder="Buscar por nombre o SKU..." 
          className="pl-10 h-12 text-lg shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Producto</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio Venta</TableHead>
              <TableHead>Disponibilidad</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center">
                      <Package className="h-4 w-4 text-slate-400" />
                    </div>
                    {product.nombre}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                <TableCell>{product.categoria}</TableCell>
                <TableCell className="font-bold text-blue-600">
                  {data.config.moneda} {product.precioVenta.toFixed(2)}
                </TableCell>
                <TableCell>
                  {product.stock <= 0 ? (
                    <Badge variant="destructive">Sin Stock</Badge>
                  ) : product.stock <= 5 ? (
                    <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">
                      Bajo Stock ({product.stock})
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      {product.stock} disponibles
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                  No se encontraron productos con ese nombre o SKU.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockPage;
