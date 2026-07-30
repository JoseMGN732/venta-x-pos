import React, { useState, useEffect } from 'react';
import { useBusiness } from '../contexts/BusinessContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Building2, Save, MapPin, Phone, Mail, Hash } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getBusiness, updateBusiness } from '../services/businessService';

const SettingsPage = () => {
  const { data, updateConfig } = useBusiness();
  const { user } = useAuth();

  const [formData, setFormData] = useState(data.config);

  const [business, setBusiness] = useState({
      nombre_negocio:"",
      telefono:"",
      correo:""
  });

  useEffect(()=>{

    const loadBusiness = async()=>{

        if(!user) return;

        const response = await getBusiness(
            user.negocioId
        );

        if(response.success){

            setBusiness(response.business);

        }

    };


    loadBusiness();


  },[user]);

  const handleSave = async()=>{


    await updateBusiness(
        user!.negocioId,
        {
            nombre_negocio: business.nombre_negocio,
            telefono: business.telefono,
            correo: business.correo
        }
    );


    updateConfig(formData);


    alert(
      "Configuración guardada correctamente."
    );

  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configuración del Negocio</h1>
        <p className="text-slate-500">Administre la información fiscal y operativa de su empresa.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" /> Información General
            </CardTitle>
            <CardDescription>Estos datos aparecerán en los tickets de venta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-slate-400" /> Nombre Comercial
                </label>
                <Input 
                  value={business.nombre_negocio}
                  disabled
                />
              </div>
              <div className="space-y-2">
              </div>
            </div>
            <div className="space-y-2">
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" /> Teléfono
                </label>
                <Input 
                  value={business.telefono}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" /> Correo Electrónico
                </label>
                <Input 
                  type="email"
                  value={business.correo}
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuración Operativa</CardTitle>
            <CardDescription>Parámetros de impuestos y moneda local.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Símbolo de Moneda</label>
                <Input 
                  value={formData.moneda}
                  onChange={(e) => setFormData({ ...formData, moneda: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Porcentaje IVA (%)</label>
                <Input 
                  type="number"
                  value={formData.impuesto}
                  onChange={(e) => setFormData({ ...formData, impuesto: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-end">
            <Button onClick={handleSave} className="bg-blue-600">
              <Save className="mr-2 h-4 w-4" /> Guardar Cambios
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
