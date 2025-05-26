
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processImage = (file: File) => {
    // File type validation - now includes DICOM files
    const validTypes = ['image/jpeg', 'image/png', 'application/dicom'];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.dcm'];
    
    const isValidType = validTypes.includes(file.type) || 
                       validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!isValidType) {
      toast({
        variant: "destructive",
        title: "Formato no válido",
        description: "Por favor selecciona una imagen en formato JPEG, PNG o DICOM (.dcm)",
      });
      return;
    }

    // Size validation (max 10MB for medical images)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Imagen demasiado grande",
        description: "El tamaño máximo permitido es de 10MB",
      });
      return;
    }

    // Create preview only for regular image formats
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // For DICOM files, show a placeholder
      setPreviewImage('dicom-placeholder');
    }

    // Pass file to parent component
    onImageSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImage(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const clearImage = () => {
    setPreviewImage(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        {!previewImage ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-all",
              dragActive 
                ? "border-primary bg-primary/5" 
                : "border-gray-200 hover:border-primary/50"
            )}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg, image/png, .dcm"
              onChange={handleChange}
              className="hidden"
            />
            <div className="flex flex-col items-center text-center">
              <div className="p-3 mb-4 rounded-full bg-secondary">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Subir Imagen Médica</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Arrastra y suelta una imagen o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                Formatos soportados: JPEG, PNG, DICOM (.dcm). Tamaño máximo: 10MB
              </p>
              <Button onClick={handleButtonClick}>
                <Upload size={16} className="mr-2" />
                Seleccionar archivo
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            {previewImage === 'dicom-placeholder' ? (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Archivo DICOM seleccionado</p>
                  <p className="text-xs text-gray-500">Vista previa no disponible</p>
                </div>
              </div>
            ) : (
              <img 
                src={previewImage} 
                alt="Preview" 
                className="w-full h-auto rounded-lg" 
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
            )}
            <Button 
              size="icon" 
              variant="destructive"
              className="absolute top-2 right-2 h-8 w-8" 
              onClick={clearImage}
            >
              <X size={16} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
