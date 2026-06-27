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
import { Building2, Plus, ExternalLink, Trash2 } from 'lucide-react';
import { Business } from '../types';
import { saveBusinessData } from '../lib/storage';

const BusinessesPage = () => {
  const { allBusinessIds, currentBusinessId, switchBusiness, refreshBusinessList } = useBusiness();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Business>({
    id: '',
    nombre: '',
    ruc: '',
    direccion: '',
    telefono: '',
    email: ''
  });

  const handleCreate = () => {
    if (!formData.id || !formData.nombre) return;
    
    // Create new business with empty data
    const newBusinessData = {
      products: [],
      users: [
        { id: `admin-${formData.id}`, username: 'admin', password: 'admin123', nombre: 'Admin ' + formData.nombre, rol: 'Administrador' as const, negocioId: formData.id }
      ],
      sales: [],
      movements: [],
      config: {
        negocioId: formData.id,
        info: formData,
        impuesto: 16,
        moneda: 'S/'
      }
    };

    saveBusinessData(formData.id, newBusinessData);
    refreshBusinessList();
    setIsModalOpen(false);
    setFormData({ id: '', nombre: '', ruc: '', direccion: '', telefono: '', email: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestión de Negocios</h1>
          <p className="text-slate-500">Administre múltiples sucursales o empresas independientes.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600">
          <Plus className="mr-2 h-4 w-4" /> Registrar Nuevo Negocio
        </Button>
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID del Negocio</TableHead>
              <TableHead>Nombre Comercial</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allBusinessIds.map((id) => (
              <TableRow key={id} className={id === currentBusinessId ? 'bg-blue-50/50' : ''}>
                <TableCell className="font-mono text-xs">{id}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    {id === 'business-1' ? 'Mi Tienda Demo' : id}
                  </div>
                </TableCell>
                <TableCell>
                  {id === currentBusinessId ? (
                    <span className="text-xs font-bold text-blue-600 uppercase">Activo (Sesión Actual)</span>
                  ) : (
                    <span className="text-xs text-slate-400">Inactivo</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => switchBusiness(id)}
                      disabled={id === currentBusinessId}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" /> Cambiar a este Negocio
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Nueva Empresa</DialogTitle>
            <DialogDescription>
              Cree un entorno independiente para una nueva sucursal o negocio.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ID Único (Sin espacios)</label>
                <Input 
                  placeholder="ej: sucursal-norte"
                  value={formData.id}
                  onChange={(e) => setFormData({...formData, id: e.target.value.toLowerCase().replace(/\s/g, '-')})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre Comercial</label>
                <Input 
                  placeholder="Mi Nueva Tienda"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">RUC / NIT</label>
              <Input 
                value={formData.ruc}
                onChange={(e) => setFormData({...formData, ruc: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Dirección</label>
              <Input 
                value={formData.direccion}
                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} className="bg-blue-600">Crear Negocio</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessesPage;
