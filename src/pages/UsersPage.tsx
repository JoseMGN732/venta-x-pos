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
import { Select } from '../components/ui/select';
import { User, Role } from '../types';
import { UserPlus, Shield, User as UserIcon, Edit2, Trash2 } from 'lucide-react';

const UsersPage = () => {
  const { data, updateUsers } = useBusiness();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<Partial<User>>({
    username: '',
    nombre: '',
    rol: 'Cajero',
    password: ''
  });

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        nombre: '',
        rol: 'Cajero',
        password: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const users = [...data.users];
    if (editingUser) {
      const index = users.findIndex(u => u.id === editingUser.id);
      users[index] = { ...editingUser, ...formData } as User;
    } else {
      const newUser: User = {
        ...formData,
        id: `u-${Date.now()}`,
        negocioId: data.config.negocioId
      } as User;
      users.push(newUser);
    }
    updateUsers(users);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (id === 'user-admin') {
      alert('No se puede eliminar el administrador principal.');
      return;
    }
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      const users = data.users.filter(u => u.id !== id);
      updateUsers(users);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestión de Usuarios</h1>
          <p className="text-slate-500">Administre el personal y sus permisos de acceso.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-blue-600">
          <UserPlus className="mr-2 h-4 w-4" /> Nuevo Usuario
        </Button>
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-slate-400" />
                    </div>
                    {user.nombre}
                  </div>
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {user.rol === 'Administrador' ? (
                      <Shield className="h-4 w-4 text-blue-600" />
                    ) : (
                      <UserIcon className="h-4 w-4 text-slate-500" />
                    )}
                    <span className={user.rol === 'Administrador' ? 'text-blue-600 font-medium' : ''}>
                      {user.rol}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                    Activo
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(user)}>
                      <Edit2 className="h-4 w-4 text-slate-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
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
            <DialogTitle>{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</DialogTitle>
            <DialogDescription>
              Asigne un rol y credenciales para el nuevo miembro del equipo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre Completo</label>
              <Input 
                placeholder="Ej: Juan Pérez"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Usuario</label>
                <Input 
                  placeholder="juan.perez"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rol</label>
                <Select 
                  options={[
                    { label: 'Administrador', value: 'Administrador' },
                    { label: 'Cajero', value: 'Cajero' }
                  ]}
                  value={formData.rol}
                  onChange={(e) => setFormData({...formData, rol: e.target.value as Role})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contraseña</label>
              <Input 
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-blue-600">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
