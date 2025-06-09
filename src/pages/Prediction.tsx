
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import ImageUploader from '@/components/ImageUploader';
import PredictionResult, { CancerPrediction } from '@/components/PredictionResult';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle, RotateCcw, Microscope, Upload, Trash2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { medicalImageService, MedicalImage } from '@/services/medicalImageService';
import { predictionService, Prediction } from '@/services/predictionService';

const PredictionPage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageForPrediction, setSelectedImageForPrediction] = useState<MedicalImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  const token = localStorage.getItem('accessToken') || '';

  // Fetch uploaded images
  const { data: uploadedImages = [], isLoading: imagesLoading, refetch: refetchImages } = useQuery({
    queryKey: ['medical-images'],
    queryFn: () => medicalImageService.getMedicalImages(token),
  });

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setPrediction(null);
  };

  const handleUploadImage = async () => {
    if (!selectedImage) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor selecciona una imagen para subir",
      });
      return;
    }

    setIsUploading(true);

    try {
      toast({
        title: "Subiendo imagen",
        description: "Subiendo imagen al servidor...",
      });

      await medicalImageService.uploadMedicalImage(selectedImage, token);
      
      toast({
        title: "Imagen subida exitosamente",
        description: "La imagen ha sido subida correctamente",
      });

      setSelectedImage(null);
      refetchImages();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Error al subir imagen",
        description: "Ha ocurrido un error al subir la imagen",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await medicalImageService.deleteMedicalImage(imageId, token);
      toast({
        title: "Imagen eliminada",
        description: "La imagen ha sido eliminada correctamente",
      });
      refetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        variant: "destructive",
        title: "Error al eliminar imagen",
        description: "Ha ocurrido un error al eliminar la imagen",
      });
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImageForPrediction) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor selecciona una imagen para analizar",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      toast({
        title: "Analizando imagen",
        description: "Procesando imagen con IA...",
      });

      const predictionResult = await predictionService.createPrediction(
        { imagen_id: selectedImageForPrediction.id },
        token
      );

      setPrediction(predictionResult);

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
    setSelectedImageForPrediction(null);
    setPrediction(null);
  };

  // Convert backend prediction to UI format
  const getCancerPrediction = (prediction: Prediction): CancerPrediction => {
    return {
      type: prediction.resultado.diagnostico,
      probability: Math.round(prediction.confidence_score * 100),
      isMalignant: prediction.resultado.diagnostico.toLowerCase().includes('cáncer') || 
                   prediction.resultado.diagnostico.toLowerCase().includes('maligno'),
      metrics: {
        precision: prediction.resultado.precision,
        recall: prediction.resultado.recall,
        accuracy: prediction.resultado.accuracy,
      }
    };
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Predicción de Cáncer</h1>
          <p className="text-muted-foreground">
            Sube imágenes médicas y realiza análisis de predicción de cáncer
          </p>
        </div>

        {!prediction ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card className="overflow-hidden border-0 shadow-md">
              <CardHeader className="bg-secondary/50">
                <CardTitle>Subir Nueva Imagen</CardTitle>
                <CardDescription>Carga una imagen médica al sistema</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ImageUploader onImageSelect={handleImageSelect} />
                
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={handleUploadImage}
                    disabled={!selectedImage || isUploading}
                    size="lg"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2" />
                        Subir imagen
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Section */}
            <Card className="overflow-hidden border-0 shadow-md">
              <CardHeader className="bg-secondary/50">
                <CardTitle>Análizar Imagen</CardTitle>
                <CardDescription>Selecciona una imagen para realizar la predicción</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Alert variant="default" className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <AlertTitle>Información importante</AlertTitle>
                  <AlertDescription>
                    Esta herramienta está diseñada para ayudar en la detección temprana, 
                    pero no reemplaza el diagnóstico profesional.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h4 className="font-semibold">Imágenes disponibles:</h4>
                  {imagesLoading ? (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : uploadedImages.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No hay imágenes disponibles. Sube una imagen primero.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                      {uploadedImages.map((image) => (
                        <div
                          key={image.id}
                          className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                            selectedImageForPrediction?.id === image.id
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedImageForPrediction(image)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <img
                                src={image.imagen}
                                alt={`Imagen ${image.id}`}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="text-sm font-medium">Imagen #{image.id}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(image.fecha_subida).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteImage(image.id);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={handleAnalyze}
                    disabled={!selectedImageForPrediction || isAnalyzing}
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Analizando...
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
            
            <PredictionResult 
              prediction={getCancerPrediction(prediction)} 
              originalImage={prediction.imagen_url}
              processedImage={prediction.imagen_url}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PredictionPage;
