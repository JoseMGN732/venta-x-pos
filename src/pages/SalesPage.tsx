import React, { useState } from 'react';
import { useBusiness } from '../contexts/BusinessContext';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Search, Eye, Download, Calendar, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Sale } from '../types';

const SalesPage = () => {
  const { data } = useBusiness();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredSales = data.sales.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.cajero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.fecha.includes(searchTerm)
  ).reverse();

  const handleViewDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reporte de Ventas</h1>
          <p className="text-slate-500">Historial completo de todas las transacciones realizadas.</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Exportar Excel
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">Ventas Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.sales.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">Ingresos Brutos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.config.moneda} {data.sales.reduce((acc, s) => acc + s.total, 0).toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">Ticket Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.config.moneda} {data.sales.length > 0 ? (data.sales.reduce((acc, s) => acc + s.total, 0) / data.sales.length).toFixed(2) : '0.00'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">Impuestos Recaudados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.config.moneda} {data.sales.reduce((acc, s) => acc + s.impuesto, 0).toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Buscar por ID, fecha o cajero..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Rango de Fechas
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Más Filtros
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Venta</TableHead>
              <TableHead>Fecha / Hora</TableHead>
              <TableHead>Cajero</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-mono text-xs">{sale.id.substring(5)}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{sale.fecha}</span>
                    <span className="text-xs text-slate-500">{sale.hora}</span>
                  </div>
                </TableCell>
                <TableCell>{sale.cajero}</TableCell>
                <TableCell>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100">
                    {sale.metodoPago}
                  </span>
                </TableCell>
                <TableCell>{sale.items.length} ítems</TableCell>
                <TableCell className="font-bold">{data.config.moneda} {sale.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleViewDetails(sale)}>
                    <Eye className="h-4 w-4 mr-2" /> Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredSales.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                  No se encontraron ventas con los criterios de búsqueda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalle de Venta #{selectedSale?.id.substring(5)}</DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm border-b pb-4">
                <div>
                  <p className="text-slate-500">Fecha:</p>
                  <p className="font-medium">{selectedSale.fecha} {selectedSale.hora}</p>
                </div>
                <div>
                  <p className="text-slate-500">Cajero:</p>
                  <p className="font-medium">{selectedSale.cajero}</p>
                </div>
                <div>
                  <p className="text-slate-500">Método de Pago:</p>
                  <p className="font-medium">{selectedSale.metodoPago}</p>
                </div>
                <div>
                  <p className="text-slate-500">Estado:</p>
                  <p className="font-medium text-green-600">Completada</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-bold uppercase text-slate-500">Productos</p>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="h-8 text-[10px]">Producto</TableHead>
                        <TableHead className="h-8 text-[10px] text-center">Cant</TableHead>
                        <TableHead className="h-8 text-[10px] text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSale.items.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell className="py-2 text-xs">{item.nombre}</TableCell>
                          <TableCell className="py-2 text-xs text-center">{item.cantidad}</TableCell>
                          <TableCell className="py-2 text-xs text-right">
                            {data.config.moneda}{item.subtotal.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-1 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal:</span>
                  <span>{data.config.moneda}{selectedSale.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Impuesto ({data.config.impuesto}%):</span>
                  <span>{data.config.moneda}{selectedSale.impuesto.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total:</span>
                  <span>{data.config.moneda}{selectedSale.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end pt-4">
            <Button className="bg-blue-600" onClick={() => setIsModalOpen(false)}>Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesPage;
