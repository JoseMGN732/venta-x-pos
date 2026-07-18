import React, { useState, useEffect } from 'react';
import { useBusiness } from '../contexts/BusinessContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '../components/ui/dialog';
import { Plus, ArrowUpRight, ArrowDownRight, History } from 'lucide-react';
import { StockMovement, Product } from '../types';
import { getProducts } from "../services/productService";

import {
    getMovements,
    createMovement
} from "../services/movementService";

const MovementsPage = () => {
  const { data } = useBusiness();
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadProducts();
    loadMovements();
  }, []);

  const loadProducts = async () => {
    const response = await getProducts();
    setProducts(response.products);
  };

  const loadMovements = async () => {
    const response = await getMovements();
    setMovements(response.movements);
  };
  
  const [formData, setFormData] = useState({
    productoId: '',
    tipo: 'entrada' as 'entrada' | 'salida',
    cantidad: 1,
    motivo: ''
  });

  const handleSave = async () => {
    if (!formData.productoId || formData.cantidad <= 0) return;

    const product = products.find(
      (p) => p.id == formData.productoId
    );

    if (!product) {
      alert("Producto no encontrado.");
      return;
    }

    // Registrar movimiento
    await createMovement({
      productoId: product.id,
      tipo: formData.tipo,
      cantidad: formData.cantidad,
      motivo: formData.motivo,
      usuario: user?.nombre || "Administrador",
    });

    // Recargar información
    await loadProducts();
    await loadMovements();

    // Cerrar ventana
    setIsModalOpen(false);

    // Limpiar formulario
    setFormData({
      productoId: "",
      tipo: "entrada",
      cantidad: 1,
      motivo: "",
    });
  };
  const getProductName = (id: number | string) => {
    return products.find((p) => p.id == id)?.nombre || "Producto Eliminado";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Movimientos de Stock</h1>
          <p className="text-slate-500">Registre entradas y salidas manuales de mercadería.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600">
          <Plus className="mr-2 h-4 w-4" /> Registrar Movimiento
        </Button>
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex items-center gap-2">
          <History className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Historial de Movimientos</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Usuario</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="text-xs">{m.fecha}</TableCell>
                <TableCell className="font-medium">{getProductName(m.productoId)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {m.tipo === 'entrada' ? (
                      <>
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-medium">Entrada</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                        <span className="text-red-600 font-medium">Salida</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-bold">{m.cantidad}</TableCell>
                <TableCell className="text-slate-600 max-w-[200px] truncate">{m.motivo}</TableCell>
                <TableCell className="text-xs">
                  {typeof m.usuario === "object"
                    ? m.usuario.nombre
                    : m.usuario}
                </TableCell>
              </TableRow>
            ))}
            {movements.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  No hay movimientos registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Movimiento de Inventario</DialogTitle>
            <DialogDescription>
              Ajuste el stock manualmente para entradas (compras, devoluciones) o salidas (merma, pérdida).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Producto</label>
              <Select 
                options={[
                  { label: '-- Seleccione un producto --', value: '' },
                  ...products.map(p => ({ label: `${p.nombre} (${p.stock} en stock)`, value: String(p.id) }))
                ]}
                value={formData.productoId}
                onChange={(e) => setFormData({...formData, productoId: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Movimiento</label>
                <Select 
                  options={[
                    { label: 'Entrada (+)', value: 'entrada' },
                    { label: 'Salida (-)', value: 'salida' }
                  ]}
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value as 'entrada' | 'salida'})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cantidad</label>
                <Input 
                  type="number"
                  min="1"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({...formData, cantidad: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Motivo / Observación</label>
              <Input 
                placeholder="Ej: Compra a proveedor, Producto dañado, etc."
                value={formData.motivo}
                onChange={(e) => setFormData({...formData, motivo: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-blue-600">Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MovementsPage;
