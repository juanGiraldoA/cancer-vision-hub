
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ImageUploader from '@/components/ImageUploader';
import PredictionResult, { CancerPrediction } from '@/components/PredictionResult';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle, RotateCcw, Microscope } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const Prediction = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<CancerPrediction | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setPrediction(null);
    
    // Create URL for original image
    const imageUrl = URL.createObjectURL(file);
    setOriginalImageUrl(imageUrl);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor selecciona una imagen para analizar",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate processed image (in a real app, this would come from the backend)
      setProcessedImageUrl(originalImageUrl);

      // Simulate prediction result (in a real app, this would come from the backend)
      const mockTypes = [
        { type: 'Melanoma', probability: 85, isMalignant: true },
        { type: 'Carcinoma Basocelular', probability: 72, isMalignant: true },
        { type: 'Carcinoma Epidermoide', probability: 64, isMalignant: true },
        { type: 'Nevus Melanocítico', probability: 91, isMalignant: false },
        { type: 'Queratosis Seborreica', probability: 88, isMalignant: false },
      ];
      
      const randomPrediction = mockTypes[Math.floor(Math.random() * mockTypes.length)];
      setPrediction(randomPrediction);

      toast({
        title: "Análisis completado",
        description: "La imagen ha sido analizada correctamente",
      });
    } catch (error) {
      console.error('Error during analysis:', error);
      toast({
        variant: "destructive",
        title: "Error en el análisis",
        description: "Ha ocurrido un error al analizar la imagen",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPrediction(null);
    setOriginalImageUrl(null);
    setProcessedImageUrl(null);
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Predicción de Cáncer</h1>
          <p className="text-muted-foreground">
            Sube una imagen para analizar y detectar posibles tipos de cáncer
          </p>
        </div>

        {!prediction ? (
          <div className="grid grid-cols-1 gap-6">
            <Card className="overflow-hidden border-0 shadow-md">
              <CardHeader className="bg-secondary/50">
                <CardTitle>Análisis de imagen</CardTitle>
                <CardDescription>Carga una imagen para realizar la predicción</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-6">
                <Alert variant="default" className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <AlertTitle>Información importante</AlertTitle>
                  <AlertDescription>
                    Esta herramienta está diseñada para ayudar en la detección temprana, 
                    pero no reemplaza el diagnóstico profesional. Siempre consulta con un médico especialista.
                  </AlertDescription>
                </Alert>
                
                <ImageUploader onImageSelect={handleImageSelect} />
                
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={handleAnalyze}
                    disabled={!selectedImage || isAnalyzing}
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Analizando imagen...
                      </>
                    ) : (
                      <>
                        <Microscope className="mr-2" />
                        Analizar imagen
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={handleReset} variant="outline">
                <RotateCcw size={16} className="mr-2" />
                Nueva predicción
              </Button>
            </div>
            
            {prediction && originalImageUrl && processedImageUrl && (
              <PredictionResult 
                prediction={prediction} 
                originalImage={originalImageUrl}
                processedImage={processedImageUrl}
              />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Prediction;
