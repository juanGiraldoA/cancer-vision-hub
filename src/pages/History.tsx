
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PredictionHistoryTable, TrainingHistoryTable } from '@/components/HistoryTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, BarChart } from 'lucide-react';
import TrainingUpload from '@/components/TrainingUpload';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Mock data for prediction history
const mockPredictions = [
  {
    id: 1,
    date: '2024-04-05T10:30:00',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=500',
    result: {
      type: 'Melanoma',
      probability: 85,
      isMalignant: true,
    },
    userId: 1,
    userName: 'Admin User',
  },
  {
    id: 2,
    date: '2024-04-04T14:22:00',
    imageUrl: 'https://images.unsplash.com/photo-1577398214900-ca0a9dae651d?q=80&w=500',
    result: {
      type: 'Nevus Melanocítico',
      probability: 92,
      isMalignant: false,
    },
    userId: 2,
    userName: 'Test User',
  },
  {
    id: 3,
    date: '2024-04-03T09:15:00',
    imageUrl: 'https://images.unsplash.com/photo-1579684288361-5c1a2957cc88?q=80&w=500',
    result: {
      type: 'Carcinoma Basocelular',
      probability: 78,
      isMalignant: true,
    },
    userId: 1,
    userName: 'Admin User',
  },
];

// Mock data for training history
const mockTrainings = [
  {
    id: 1,
    date: '2024-04-02T08:00:00',
    fileName: 'dataset_v3.xlsx',
    accuracy: 94,
    userId: 1,
    userName: 'Admin User',
    datasetSize: 5230,
  },
  {
    id: 2,
    date: '2024-03-15T11:45:00',
    fileName: 'dataset_v2.xlsx',
    accuracy: 91,
    userId: 1,
    userName: 'Admin User',
    datasetSize: 4850,
  },
  {
    id: 3,
    date: '2024-02-28T16:30:00',
    fileName: 'dataset_v1.xlsx',
    accuracy: 88,
    userId: 1,
    userName: 'Admin User',
    datasetSize: 3920,
  },
];

const History = () => {
  const [isTrainingDialogOpen, setIsTrainingDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingSuccess, setTrainingSuccess] = useState(false);
  const { currentUser } = useAuth();
  
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setTrainingSuccess(false);
  };

  const handleStartTraining = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor selecciona un archivo para el entrenamiento",
      });
      return;
    }

    setIsTraining(true);

    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 5000));

      setTrainingSuccess(true);
      
      toast({
        title: "Entrenamiento completado",
        description: "El modelo ha sido reentrenado exitosamente",
      });
    } catch (error) {
      console.error('Error during training:', error);
      toast({
        variant: "destructive",
        title: "Error en el entrenamiento",
        description: "Ha ocurrido un error al entrenar el modelo",
      });
    } finally {
      setIsTraining(false);
    }
  };

  const handleCloseDialog = () => {
    setIsTrainingDialogOpen(false);
    setSelectedFile(null);
    setTrainingSuccess(false);
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Historial</h1>
            <p className="text-muted-foreground">
              Revisa el historial de predicciones y entrenamientos
            </p>
          </div>
          {currentUser?.role === 'admin' && (
            <Button onClick={() => setIsTrainingDialogOpen(true)}>
              <FileSpreadsheet size={16} className="mr-2" />
              Reentrenar modelo
            </Button>
          )}
        </div>

        <Tabs defaultValue="predictions" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="predictions">Predicciones</TabsTrigger>
            <TabsTrigger value="trainings">Entrenamientos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="predictions">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-secondary/50">
                <CardTitle>Historial de predicciones</CardTitle>
                <CardDescription>Registro de predicciones realizadas</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <PredictionHistoryTable history={mockPredictions} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trainings">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-secondary/50">
                <CardTitle>Historial de entrenamientos</CardTitle>
                <CardDescription>Registro de entrenamientos del modelo</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <TrainingHistoryTable history={mockTrainings} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Training Dialog */}
      <Dialog open={isTrainingDialogOpen} onOpenChange={setIsTrainingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reentrenar Modelo</DialogTitle>
            <DialogDescription>
              Sube un archivo Excel o CSV con datos etiquetados para reentrenar el modelo de predicción
            </DialogDescription>
          </DialogHeader>
          
          {trainingSuccess ? (
            <div className="py-6">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Modelo reentrenado correctamente</h3>
                <p className="text-sm text-gray-500">
                  El modelo ha sido actualizado con los nuevos datos. Las predicciones ahora utilizarán este modelo mejorado.
                </p>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <BarChart size={20} className="text-blue-500" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Precisión del nuevo modelo: 96%</p>
                    <p className="text-xs text-gray-500">Mejora: +2% respecto al modelo anterior</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <TrainingUpload onFileSelect={handleFileSelect} />
              
              {selectedFile && (
                <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
                  <AlertTitle>Información importante</AlertTitle>
                  <AlertDescription>
                    El reentrenamiento puede tomar varios minutos dependiendo del tamaño del archivo. 
                    No cierre esta ventana durante el proceso.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              {trainingSuccess ? 'Cerrar' : 'Cancelar'}
            </Button>
            {!trainingSuccess && (
              <Button 
                onClick={handleStartTraining} 
                disabled={!selectedFile || isTraining}
              >
                {isTraining ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Entrenando...
                  </>
                ) : (
                  'Iniciar entrenamiento'
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default History;
