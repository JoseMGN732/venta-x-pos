import React, { useState } from 'react';
import { useBusiness } from '../contexts/BusinessContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
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
import { Badge } from '../components/ui/badge';
import { Select } from '../components/ui/select';
import { CATEGORIES } from '../lib/constants';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import { Product } from '../types';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../services/productService";
import { useEffect } from "react";

const ProductsPage = () => {
  const { data } = useBusiness();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {

    const response = await getProducts();

    console.log(response);

    if (response.success) {
        setProducts(response.products);
    }

  };

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    nombre: '',
    categoria: CATEGORIES[0],
    sku: '',
    precioCompra: 0,
    precioVenta: 0,
    stock: 0
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || p.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: '',
        categoria: CATEGORIES[0],
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        precioCompra: 0,
        precioVenta: 0,
        stock: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {

    if (editingProduct) {

      await updateProduct(editingProduct.id, formData);

    } else {

      await createProduct(formData);

    }

    await loadProducts();

    setIsModalOpen(false);

  };

  const handleDelete = async (id: string) => {

    if (!confirm("¿Eliminar este producto?")) return;

    await deleteProduct(id);

    await loadProducts();

  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Productos</h1>
          <p className="text-slate-500">Gestione el catálogo de productos de su negocio.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-blue-600">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Buscar por nombre o SKU..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select 
            options={['Todas', ...CATEGORIES].map(c => ({ label: c, value: c }))}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-[180px]"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Precio Venta</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-slate-400" />
                    </div>
                    {product.nombre}
                  </div>
                </TableCell>
                <TableCell>{product.categoria}</TableCell>
                <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                <TableCell>
                  {data.config.moneda} {product.precioVenta.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant={product.stock <= 5 ? "destructive" : "secondary"}>
                    {product.stock} unidades
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(product)}>
                      <Edit2 className="h-4 w-4 text-slate-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  No se encontraron productos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}</DialogTitle>
            <DialogDescription>
              Complete la información del producto a continuación.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre</label>
                <Input 
                  value={formData.nombre} 
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SKU</label>
                <Input 
                  value={formData.sku} 
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoría</label>
                <Select 
                  options={CATEGORIES.map(c => ({ label: c, value: c }))}
                  value={formData.categoria}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Inicial</label>
                <Input 
                  type="number"
                  value={formData.stock} 
                  onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Precio Compra</label>
                <Input 
                  type="number"
                  step="0.01"
                  value={formData.precioCompra} 
                  onChange={(e) => setFormData({...formData, precioCompra: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Precio Venta</label>
                <Input 
                  type="number"
                  step="0.01"
                  value={formData.precioVenta} 
                  onChange={(e) => setFormData({...formData, precioVenta: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-blue-600">Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;
