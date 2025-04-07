
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Eye, Download } from 'lucide-react';
import { CancerPrediction } from '@/components/PredictionResult';

export interface PredictionHistory {
  id: number;
  date: string;
  imageUrl: string;
  result: CancerPrediction;
  userId: number;
  userName: string;
}

export interface TrainingHistory {
  id: number;
  date: string;
  fileName: string;
  accuracy: number;
  userId: number;
  userName: string;
  datasetSize: number;
}

interface PredictionHistoryTableProps {
  history: PredictionHistory[];
}

interface TrainingHistoryTableProps {
  history: TrainingHistory[];
}

export const PredictionHistoryTable: React.FC<PredictionHistoryTableProps> = ({ history }) => {
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionHistory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (prediction: PredictionHistory) => {
    setSelectedPrediction(prediction);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Resultado</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Probabilidad</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{new Date(item.date).toLocaleString()}</TableCell>
                <TableCell>{item.userName}</TableCell>
                <TableCell>
                  <Badge className={item.result.isMalignant ? "bg-red-500" : "bg-green-500"}>
                    {item.result.isMalignant ? 'Maligno' : 'Benigno'}
                  </Badge>
                </TableCell>
                <TableCell>{item.result.type}</TableCell>
                <TableCell>{item.result.probability}%</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleViewDetails(item)} 
                    className="text-blue-600"
                  >
                    <Eye size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {history.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No hay registros de predicciones
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Prediction Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Predicción</DialogTitle>
          </DialogHeader>

          {selectedPrediction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm mb-2">Imagen</h3>
                  <img 
                    src={selectedPrediction.imageUrl} 
                    alt="Predicción" 
                    className="w-full h-auto rounded-md" 
                    style={{ maxHeight: '300px', objectFit: 'contain' }}
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Información</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">ID:</div>
                      <div>{selectedPrediction.id}</div>
                      <div className="font-medium">Fecha:</div>
                      <div>{new Date(selectedPrediction.date).toLocaleString()}</div>
                      <div className="font-medium">Usuario:</div>
                      <div>{selectedPrediction.userName}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm mb-2">Resultado</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Tipo:</div>
                      <div>{selectedPrediction.result.type}</div>
                      <div className="font-medium">Malignidad:</div>
                      <div>
                        <Badge className={selectedPrediction.result.isMalignant ? "bg-red-500" : "bg-green-500"}>
                          {selectedPrediction.result.isMalignant ? 'Maligno' : 'Benigno'}
                        </Badge>
                      </div>
                      <div className="font-medium">Probabilidad:</div>
                      <div>{selectedPrediction.result.probability}%</div>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Download size={16} className="mr-2" />
                    Descargar reporte
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export const TrainingHistoryTable: React.FC<TrainingHistoryTableProps> = ({ history }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">ID</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Archivo</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Tamaño Dataset</TableHead>
            <TableHead>Precisión</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>{new Date(item.date).toLocaleString()}</TableCell>
              <TableCell>{item.fileName}</TableCell>
              <TableCell>{item.userName}</TableCell>
              <TableCell>{item.datasetSize.toLocaleString()} registros</TableCell>
              <TableCell>{item.accuracy}%</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="text-blue-600">
                  <Download size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {history.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No hay registros de entrenamientos
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
