import React, { useState } from 'react';
import { useBusiness } from '../contexts/BusinessContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Palette, Save, Image as ImageIcon, Type } from 'lucide-react';

const BrandingPage = () => {
  const { data, updateConfig } = useBusiness();
  const [formData, setFormData] = useState(
    data.config.branding ?? {
      colorPrimario: "#2563eb",
      colorSecundario: "#64748b",
      tipografia: "Inter",
      logo: ""
    }
  );
  const handleSave = () => {
    updateConfig({
      ...data.config,
      branding: formData
    });
    alert('Identidad visual actualizada.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Personalización (Branding)</h1>
        <p className="text-slate-500">Ajuste la apariencia visual de su negocio en el sistema.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Palette className="h-5 w-5" /> Colores de Marca
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Color Primario</label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    className="w-12 h-10 p-1" 
                    value={formData.colorPrimario}
                    onChange={(e) => setFormData({...formData, colorPrimario: e.target.value})}
                  />
                  <Input 
                    value={formData.colorPrimario}
                    onChange={(e) => setFormData({...formData, colorPrimario: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color Secundario</label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    className="w-12 h-10 p-1" 
                    value={formData.colorSecundario}
                    onChange={(e) => setFormData({...formData, colorSecundario: e.target.value})}
                  />
                  <Input 
                    value={formData.colorSecundario}
                    onChange={(e) => setFormData({...formData, colorSecundario: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Type className="h-5 w-5" /> Tipografía y Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fuente Principal</label>
                <Input 
                  value={formData.tipografia}
                  onChange={(e) => setFormData({...formData, tipografia: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">URL del Logo</label>
                <Input 
                  placeholder="https://ejemplo.com/logo.png"
                  value={formData.logo}
                  onChange={(e) => setFormData({...formData, logo: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t p-4">
              <Button onClick={handleSave} className="bg-blue-600">
                <Save className="mr-2 h-4 w-4" /> Aplicar Cambios
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
              <CardDescription>Así se verá su panel de control.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-8 bg-slate-100 rounded-b-lg min-h-[300px]">
              <div className="w-full max-w-[200px] space-y-4 bg-white p-4 rounded-xl shadow-lg border border-slate-200">
                <div className="flex items-center gap-2">
                  <div 
                    className="h-8 w-8 rounded-full" 
                    style={{ backgroundColor: formData.colorPrimario }}
                  ></div>
                  <div className="h-2 w-24 bg-slate-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-10 w-full rounded" style={{ backgroundColor: formData.colorPrimario }}></div>
                  <div className="h-10 w-full rounded border border-slate-200"></div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-2 w-12 bg-slate-100 rounded"></div>
                  <div className="h-4 w-12 rounded" style={{ backgroundColor: formData.colorPrimario }}></div>
                </div>
              </div>
              <p className="mt-6 text-xs text-slate-500 text-center">
                Los cambios se aplican globalmente a todos los usuarios de este negocio.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BrandingPage;
