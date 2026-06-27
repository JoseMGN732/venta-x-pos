import React, { useState, useEffect, useMemo } from 'react';
import { useBusiness } from '../contexts/BusinessContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  ArrowRightLeft,
  CheckCircle2,
  Printer,
  X
} from 'lucide-react';
import { Sale, SaleItem, Product } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { cn } from '../lib/utils';

const POSPage = () => {
  const { data, updateProducts, updateSales } = useBusiness();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);

  const filteredProducts = useMemo(() => {
    return data.products.filter(p => 
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data.products, searchTerm]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('Producto sin stock disponible.');
      return;
    }

    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      if (existingItem.cantidad >= product.stock) {
        alert('No hay más stock disponible.');
        return;
      }
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.precioUnitario }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        nombre: product.nombre,
        cantidad: 1,
        precioUnitario: product.precioVenta,
        subtotal: product.precioVenta
      }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    const product = data.products.find(p => p.id === productId);
    if (!product) return;

    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(0, item.cantidad + delta);
        if (newQty > product.stock) {
          alert('No hay más stock disponible.');
          return item;
        }
        return { ...item, cantidad: newQty, subtotal: newQty * item.precioUnitario };
      }
      return item;
    }).filter(item => item.cantidad > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
  const tax = subtotal * (data.config.impuesto / 100);
  const total = subtotal + tax;

  const handleFinalizeSale = () => {
    if (cart.length === 0) return;

    const now = new Date();
    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      fecha: now.toISOString().split('T')[0],
      hora: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [...cart],
      subtotal,
      impuesto: tax,
      total,
      metodoPago: paymentMethod,
      cajero: user?.nombre || 'Cajero',
      negocioId: data.config.negocioId
    };

    // Update stock for all products in cart
    const updatedProducts = data.products.map(p => {
      const cartItem = cart.find(item => item.productId === p.id);
      if (cartItem) {
        return { ...p, stock: p.stock - cartItem.cantidad };
      }
      return p;
    });

    updateProducts(updatedProducts);
    updateSales([...data.sales, newSale]);
    setLastSale(newSale);
    setCart([]);
    setShowReceipt(true);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 overflow-hidden">
      {/* Product Selection Panel */}
      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Buscar productos por nombre o código SKU..." 
            className="pl-10 h-12 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <Card 
                key={product.id} 
                className={cn(
                  "cursor-pointer hover:border-blue-500 transition-all flex flex-col",
                  product.stock <= 0 && "opacity-60 grayscale"
                )}
                onClick={() => addToCart(product)}
              >
                <div className="aspect-square bg-slate-100 flex items-center justify-center relative overflow-hidden">
                  {product.imagen ? (
                    <img src={product.imagen} alt={product.nombre} className="object-cover w-full h-full" />
                  ) : (
                    <ShoppingCart className="h-10 w-10 text-slate-300" />
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase",
                      product.stock <= 5 ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                    )}>
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>
                <CardContent className="p-3 flex-1 flex flex-col justify-between">
                  <h4 className="font-semibold text-sm line-clamp-2 mb-1">{product.nombre}</h4>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-slate-500">{product.sku}</span>
                    <span className="font-bold text-blue-600">
                      {data.config.moneda}{product.precioVenta.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Panel */}
      <Card className="w-96 flex flex-col shadow-lg border-blue-100">
        <CardHeader className="py-4 border-b bg-slate-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-600" /> Carrito de Venta
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
              <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
              <p>El carrito está vacío. Agregue productos para comenzar.</p>
            </div>
          ) : (
            <div className="divide-y">
              {cart.map(item => (
                <div key={item.productId} className="p-4 space-y-2">
                  <div className="flex justify-between font-medium text-sm">
                    <span className="line-clamp-1">{item.nombre}</span>
                    <span>{data.config.moneda}{item.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.productId, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-bold">{item.cantidad}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.productId, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col border-t p-4 bg-slate-50 gap-4">
          <div className="w-full space-y-1">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>{data.config.moneda}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Impuesto ({data.config.impuesto}%)</span>
              <span>{data.config.moneda}{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-slate-900 pt-2 border-t">
              <span>Total</span>
              <span>{data.config.moneda}{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="w-full space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Método de Pago</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Efectivo', icon: Banknote },
                { id: 'Tarjeta', icon: CreditCard },
                { id: 'Transferencia', icon: ArrowRightLeft }
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-md border transition-all",
                    paymentMethod === method.id 
                      ? "bg-blue-600 border-blue-600 text-white" 
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <method.icon className="h-4 w-4 mb-1" />
                  <span className="text-[10px] font-medium">{method.id}</span>
                </button>
              ))}
            </div>
          </div>

          <Button 
            className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
            disabled={cart.length === 0}
            onClick={handleFinalizeSale}
          >
            Finalizar Venta
          </Button>
        </CardFooter>
      </Card>

      {/* Receipt Modal */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-6 w-6" /> ¡Venta Exitosa!
            </DialogTitle>
          </DialogHeader>
          {lastSale && (
            <div className="bg-white p-6 border rounded-lg shadow-inner font-mono text-sm space-y-4">
              <div className="text-center border-b pb-4">
                <h3 className="font-bold text-lg uppercase">{data.config.info.nombre}</h3>
                <p className="text-xs">{data.config.info.direccion}</p>
                <p className="text-xs">RUC: {data.config.info.ruc}</p>
                <p className="text-xs">Tel: {data.config.info.telefono}</p>
              </div>
              
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>FECHA: {lastSale.fecha}</span>
                  <span>HORA: {lastSale.hora}</span>
                </div>
                <p>CAJERO: {lastSale.cajero}</p>
                <p>TICKET: {lastSale.id.substring(5)}</p>
              </div>

              <div className="border-t border-b py-2 space-y-1">
                <div className="flex justify-between font-bold text-[10px] mb-1">
                  <span className="w-1/2">PRODUCTO</span>
                  <span className="w-1/6 text-right">CANT</span>
                  <span className="w-1/3 text-right">TOTAL</span>
                </div>
                {lastSale.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-[10px]">
                    <span className="w-1/2 truncate">{item.nombre}</span>
                    <span className="w-1/6 text-right">{item.cantidad}</span>
                    <span className="w-1/3 text-right">{data.config.moneda}{item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>SUBTOTAL:</span>
                  <span>{data.config.moneda}{lastSale.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA ({data.config.impuesto}%):</span>
                  <span>{data.config.moneda}{lastSale.impuesto.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>TOTAL:</span>
                  <span>{data.config.moneda}{lastSale.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 text-xs">
                <p>MÉTODO DE PAGO: {lastSale.metodoPago}</p>
              </div>

              <div className="text-center pt-4 border-t italic">
                <p>¡Gracias por su compra!</p>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowReceipt(false)}>
              Cerrar
            </Button>
            <Button className="flex-1 bg-blue-600">
              <Printer className="mr-2 h-4 w-4" /> Imprimir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POSPage;
