
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
    // File type validation
    if (!file.type.match('image.*')) {
      toast({
        variant: "destructive",
        title: "Formato no válido",
        description: "Por favor selecciona una imagen en formato JPEG o PNG",
      });
      return;
    }

    // Size validation (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Imagen demasiado grande",
        description: "El tamaño máximo permitido es de 5MB",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

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
    <Card className="relative">
      <CardContent className="p-0">
        {!previewImage ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-all",
              dragActive 
                ? "border-primary bg-primary/5" 
                : "border-gray-300 hover:border-primary/50"
            )}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleChange}
              className="hidden"
            />
            <div className="flex flex-col items-center text-center">
              <div className="p-3 mb-4 rounded-full bg-primary/10">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Subir Imagen</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Arrastra y suelta una imagen o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                Formatos soportados: JPEG, PNG. Tamaño máximo: 5MB
              </p>
              <Button onClick={handleButtonClick} className="medical-gradient">
                <Upload size={16} className="mr-2" />
                Seleccionar archivo
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="w-full h-auto rounded-lg" 
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
            <Button 
              size="icon" 
              variant="destructive"
              className="absolute top-2 right-2" 
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
