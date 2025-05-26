
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ImageUploader from '@/components/ImageUploader';
import PredictionResult, { CancerPrediction } from '@/components/PredictionResult';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle, RotateCcw, Microscope } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { medicalImageService, MedicalImage } from '@/services/medicalImageService';
import { predictionService } from '@/services/predictionService';

const Prediction = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<MedicalImage | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<CancerPrediction | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  const token = localStorage.getItem('accessToken') || '';

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setPrediction(null);
    setUploadedImage(null);
    
    // Create URL for original image preview
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
      // First upload the image
      toast({
        title: "Subiendo imagen",
        description: "Subiendo imagen al servidor...",
      });

      const uploadedImageData = await medicalImageService.uploadMedicalImage(selectedImage, token);
      setUploadedImage(uploadedImageData);

      // Simulate AI analysis and create prediction
      toast({
        title: "Analizando imagen",
        description: "Procesando imagen con IA...",
      });

      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Create mock prediction data
      const mockDiagnostics = [
        { diagnostico: 'maligno', region_afectada: 'lóbulo superior derecho' },
        { diagnostico: 'benigno', region_afectada: 'sin región específica' },
        { diagnostico: 'maligno', region_afectada: 'lóbulo inferior izquierdo' },
      ];

      const randomDiagnostic = mockDiagnostics[Math.floor(Math.random() * mockDiagnostics.length)];
      const confidenceScore = Math.random() * 0.3 + 0.7; // Between 0.7 and 1.0

      const predictionData = {
        resultado: randomDiagnostic,
        confidence_score: confidenceScore,
        imagen: uploadedImageData.id,
      };

      const predictionResult = await predictionService.createPrediction(predictionData, token);

      // Convert to our CancerPrediction format for the UI
      const cancerPrediction: CancerPrediction = {
        type: `${predictionResult.resultado.diagnostico} - ${predictionResult.resultado.region_afectada}`,
        probability: Math.round(predictionResult.confidence_score * 100),
        isMalignant: predictionResult.resultado.diagnostico === 'maligno',
      };

      setPrediction(cancerPrediction);

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
    setUploadedImage(null);
    setOriginalImageUrl(null);
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
            
            {prediction && originalImageUrl && uploadedImage && (
              <PredictionResult 
                prediction={prediction} 
                originalImage={originalImageUrl}
                processedImage={uploadedImage.imagen}
              />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Prediction;
