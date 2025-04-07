
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface CancerPrediction {
  type: string;
  probability: number;
  isMalignant: boolean;
}

interface PredictionResultProps {
  prediction: CancerPrediction;
  originalImage: string;
  processedImage: string;
}

const PredictionResult: React.FC<PredictionResultProps> = ({
  prediction,
  originalImage,
  processedImage,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Imagen Original</CardTitle>
          </CardHeader>
          <CardContent>
            <img 
              src={originalImage} 
              alt="Imagen original" 
              className="w-full h-auto rounded-md" 
              style={{ maxHeight: '300px', objectFit: 'contain' }}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Imagen Procesada</CardTitle>
          </CardHeader>
          <CardContent>
            <img 
              src={processedImage} 
              alt="Imagen procesada" 
              className="w-full h-auto rounded-md" 
              style={{ maxHeight: '300px', objectFit: 'contain' }}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Resultado del Análisis</CardTitle>
            <Badge className={prediction.isMalignant ? "bg-red-500" : "bg-green-500"}>
              {prediction.isMalignant ? 'Maligno' : 'Benigno'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1">Tipo detectado</p>
                <p className="text-xl font-bold">{prediction.type}</p>
              </div>
              {prediction.isMalignant ? (
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">Probabilidad</p>
                <p className="text-sm font-medium">{prediction.probability}%</p>
              </div>
              <Progress value={prediction.probability} className={prediction.isMalignant ? "text-red-500" : "text-green-500"} />
            </div>
            
            <div className="p-3 rounded-lg bg-secondary text-sm">
              <p className="font-semibold mb-1">Notas del análisis:</p>
              <p className="text-muted-foreground">
                {prediction.isMalignant 
                  ? 'Se recomienda realizar exámenes adicionales. Esta predicción debe ser confirmada por un especialista médico.' 
                  : 'No se detectan signos de malignidad. Se recomienda mantener los chequeos médicos regulares.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionResult;
