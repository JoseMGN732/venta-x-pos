import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBusiness } from '../../contexts/BusinessContext';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  Building2, 
  ChevronDown,
  User as UserIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';

const TopBar = () => {
  const { user } = useAuth();
  const { currentBusinessId, allBusinessIds, switchBusiness, data } = useBusiness();

  // In a real app, we'd fetch business names for allBusinessIds
  // For now, we just show the current business name
  
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-1.5">
          <Building2 className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-semibold text-slate-700">
            {data.config.info.nombre}
          </span>
          {user?.rol === 'Administrador' && (
            <select 
              className="ml-2 bg-transparent text-xs focus:outline-none"
              value={currentBusinessId}
              onChange={(e) => switchBusiness(e.target.value)}
            >
              {allBusinessIds.map(id => (
                <option key={id} value={id}>{id === 'business-1' ? 'Mi Tienda Demo' : id}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-slate-900">{user?.nombre}</span>
          <span className="text-xs text-slate-500">{user?.rol}</span>
        </div>
        <Avatar className="h-9 w-9 border border-slate-200">
          <AvatarFallback className="bg-blue-100 text-blue-600">
            <UserIcon className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default TopBar;
