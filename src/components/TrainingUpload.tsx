
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileSpreadsheet, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface TrainingUploadProps {
  onFileSelect: (file: File) => void;
}

const TrainingUpload: React.FC<TrainingUploadProps> = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  const processFile = (file: File) => {
    // File type validation
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
      toast({
        variant: "destructive",
        title: "Formato no válido",
        description: "Por favor selecciona un archivo Excel (.xlsx) o CSV (.csv)",
      });
      return;
    }

    // Size validation (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Archivo demasiado grande",
        description: "El tamaño máximo permitido es de 10MB",
      });
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        {!selectedFile ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-all",
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
              accept=".xlsx,.csv"
              onChange={handleChange}
              className="hidden"
            />
            <div className="flex flex-col items-center text-center">
              <div className="p-3 mb-4 rounded-full bg-secondary">
                <FileSpreadsheet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Subir datos de entrenamiento</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Arrastra y suelta un archivo o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                Formatos soportados: Excel (.xlsx), CSV (.csv). Tamaño máximo: 10MB
              </p>
              <Button onClick={handleButtonClick} className="medical-gradient">
                <Upload size={16} className="mr-2" />
                Seleccionar archivo
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-secondary rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-secondary border border-primary/20">
                  <FileSpreadsheet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button 
                size="icon" 
                variant="ghost"
                className="h-8 w-8" 
                onClick={clearFile}
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainingUpload;
