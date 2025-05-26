
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { trainingService } from '@/services/trainingService';
import { predictionService } from '@/services/predictionService';

const History = () => {
  const [isTrainingDialogOpen, setIsTrainingDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingSuccess, setTrainingSuccess] = useState(false);
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const token = localStorage.getItem('accessToken') || '';
  
  // Fetch predictions from backend
  const { data: predictions = [] } = useQuery({
    queryKey: ['predictions'],
    queryFn: () => predictionService.getPredictions(token),
  });

  // Fetch training files from backend
  const { data: trainings = [] } = useQuery({
    queryKey: ['trainings'],
    queryFn: () => trainingService.getTrainingFiles(token),
  });

  // Upload training file mutation
  const uploadTrainingMutation = useMutation({
    mutationFn: (file: File) => trainingService.uploadTrainingFile(file, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      setTrainingSuccess(true);
      toast({
        title: "Archivo subido correctamente",
        description: "El archivo de entrenamiento ha sido subido exitosamente",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error al subir archivo",
        description: error.message || "Ha ocurrido un error al subir el archivo",
      });
      setIsTraining(false);
    },
  });

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
    uploadTrainingMutation.mutate(selectedFile);
  };

  const handleCloseDialog = () => {
    setIsTrainingDialogOpen(false);
    setSelectedFile(null);
    setTrainingSuccess(false);
    setIsTraining(false);
  };

  // Transform predictions to match the expected format
  const transformedPredictions = predictions.map(prediction => ({
    id: prediction.id,
    date: prediction.fecha,
    imageUrl: `http://127.0.0.1:8000${prediction.imagen}`, // Assuming imagen contains the image ID, you might need to fetch the actual URL
    result: {
      type: `${prediction.resultado.diagnostico} - ${prediction.resultado.region_afectada}`,
      probability: Math.round(prediction.confidence_score * 100),
      isMalignant: prediction.resultado.diagnostico === 'maligno',
    },
    userId: prediction.usuario,
    userName: prediction.usuario_email,
  }));

  // Transform trainings to match the expected format
  const transformedTrainings = trainings.map(training => ({
    id: training.id,
    date: training.fecha,
    fileName: training.archivo.split('/').pop() || 'Unknown file',
    accuracy: 90 + Math.floor(Math.random() * 10), // Mock accuracy for now
    userId: training.usuario,
    userName: training.usuario_email,
    datasetSize: Math.floor(Math.random() * 5000) + 1000, // Mock dataset size
  }));

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
          {currentUser?.role === 'ADMIN' && (
            <Button onClick={() => setIsTrainingDialogOpen(true)}>
              <FileSpreadsheet size={16} className="mr-2" />
              Subir archivo de entrenamiento
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
                <PredictionHistoryTable history={transformedPredictions} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trainings">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-secondary/50">
                <CardTitle>Historial de entrenamientos</CardTitle>
                <CardDescription>Registro de archivos de entrenamiento subidos</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <TrainingHistoryTable history={transformedTrainings} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Training Dialog */}
      <Dialog open={isTrainingDialogOpen} onOpenChange={setIsTrainingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Subir archivo de entrenamiento</DialogTitle>
            <DialogDescription>
              Sube un archivo CSV, Excel o ZIP con datos etiquetados para entrenar el modelo
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
                <h3 className="text-lg font-medium text-gray-900">Archivo subido correctamente</h3>
                <p className="text-sm text-gray-500">
                  El archivo ha sido subido exitosamente y está disponible para entrenamiento del modelo.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <TrainingUpload onFileSelect={handleFileSelect} />
              
              {selectedFile && (
                <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
                  <AlertTitle>Información importante</AlertTitle>
                  <AlertDescription>
                    El archivo será subido al servidor. Asegúrate de que contenga datos correctamente etiquetados.
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
                    Subiendo...
                  </>
                ) : (
                  'Subir archivo'
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
