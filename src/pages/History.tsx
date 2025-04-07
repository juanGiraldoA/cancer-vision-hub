
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PredictionHistoryTable, TrainingHistoryTable } from '@/components/HistoryTable';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';
import TrainingUpload from '@/components/TrainingUpload';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
  const { currentUser } = useAuth();
  
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
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

      toast({
        title: "Entrenamiento completado",
        description: "El modelo ha sido reentrenado exitosamente",
      });

      setIsTrainingDialogOpen(false);
      setSelectedFile(null);
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
            <Button className="medical-gradient" onClick={() => setIsTrainingDialogOpen(true)}>
              <FileSpreadsheet size={16} className="mr-2" />
              Reentrenar modelo
            </Button>
          )}
        </div>

        <Tabs defaultValue="predictions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="predictions">Predicciones</TabsTrigger>
            <TabsTrigger value="trainings">Entrenamientos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="predictions">
            <Card>
              <CardContent className="pt-6">
                <PredictionHistoryTable history={mockPredictions} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trainings">
            <Card>
              <CardContent className="pt-6">
                <TrainingHistoryTable history={mockTrainings} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Training Dialog */}
      <Dialog open={isTrainingDialogOpen} onOpenChange={setIsTrainingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reentrenar Modelo</DialogTitle>
            <DialogDescription>
              Sube un archivo Excel o CSV con datos etiquetados para reentrenar el modelo de predicción
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <TrainingUpload onFileSelect={handleFileSelect} />
            
            {selectedFile && (
              <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                <p className="font-medium mb-1">Información importante</p>
                <p>El reentrenamiento puede tomar varios minutos dependiendo del tamaño del archivo. No cierre esta ventana durante el proceso.</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTrainingDialogOpen(false)} disabled={isTraining}>
              Cancelar
            </Button>
            <Button 
              onClick={handleStartTraining} 
              disabled={!selectedFile || isTraining}
              className="medical-gradient"
            >
              {isTraining ? (
                <>
                  <span className="animate-spin mr-2">⚪</span>
                  Entrenando...
                </>
              ) : (
                'Iniciar entrenamiento'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default History;
