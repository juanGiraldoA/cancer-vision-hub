
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface CancerPrediction {
  type: string;
  probability: number;
  isMalignant: boolean;
  metrics?: {
    precision: number;
    recall: number;
    accuracy: number;
  };
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
                <p className="text-sm font-medium mb-1">Diagnóstico</p>
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
                <p className="text-sm font-medium">Confianza</p>
                <p className="text-sm font-medium">{prediction.probability}%</p>
              </div>
              <Progress value={prediction.probability} className={prediction.isMalignant ? "text-red-500" : "text-green-500"} />
            </div>

            {prediction.metrics && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Precisión</p>
                  <p className="text-lg font-bold">{(prediction.metrics.precision * 100).toFixed(1)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Recall</p>
                  <p className="text-lg font-bold">{(prediction.metrics.recall * 100).toFixed(1)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Exactitud</p>
                  <p className="text-lg font-bold">{(prediction.metrics.accuracy * 100).toFixed(1)}%</p>
                </div>
              </div>
            )}
            
            <div className="p-3 rounded-lg bg-secondary text-sm">
              <p className="font-semibold mb-1">Notas del análisis:</p>
              <p className="text-muted-foreground">
                {prediction.isMalignant 
                  ? 'Se detectaron signos que requieren atención médica inmediata. Consulte con un especialista.' 
                  : 'No se detectan signos de malignidad en esta imagen. Mantenga los chequeos médicos regulares.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionResult;
