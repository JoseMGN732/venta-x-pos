import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBusiness } from '../../contexts/BusinessContext';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Building2,
  User as UserIcon
} from 'lucide-react';

const TopBar = () => {

  const { user } = useAuth();
  const { data } = useBusiness();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-1.5">

          <Building2 className="h-4 w-4 text-slate-500" />

          <span className="text-sm font-semibold text-slate-700">
            {data.config.info.nombre}
          </span>

        </div>

      </div>

      <div className="flex items-center gap-4">

        <div className="flex flex-col items-end">

          <span className="text-sm font-medium text-slate-900">
            {user?.nombre}
          </span>

          <span className="text-xs text-slate-500">
            {user?.rol}
          </span>

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