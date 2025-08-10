
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Image, Users, Clock, LineChart as LineChartIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { predictionService, type Prediction } from '@/services/predictionService';


const Dashboard = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const data = await predictionService.getPredictions(token);
          setPredictions(data);
        }
      } catch (error) {
        console.error('Error fetching predictions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  // Calculate metrics from real data
  const totalPredictions = predictions.length;
  const averageAccuracy = predictions.length > 0 
    ? Math.round(predictions.reduce((sum, p) => sum + (p.resultado.accuracy * 100), 0) / predictions.length)
    : 0;
  const averageAnalysisTime = '1.2s'; // This would need to be calculated if the backend provides timing data

  // Group predictions by month for charts
  const monthlyData = predictions.reduce((acc, prediction) => {
    const date = new Date(prediction.fecha);
    const month = date.toLocaleDateString('es-ES', { month: 'short' });
    const existing = acc.find(item => item.name === month);
    
    if (existing) {
      existing.predictions += 1;
      existing.totalAccuracy += prediction.resultado.accuracy * 100;
      existing.accuracy = Math.round(existing.totalAccuracy / existing.predictions);
    } else {
      acc.push({
        name: month,
        predictions: 1,
        accuracy: Math.round(prediction.resultado.accuracy * 100),
        totalAccuracy: prediction.resultado.accuracy * 100
      });
    }
    return acc;
  }, [] as Array<{ name: string; predictions: number; accuracy: number; totalAccuracy: number }>);

  const chartData = monthlyData.length > 0 ? monthlyData : [
    { name: 'Ene', predictions: 0, accuracy: 0 },
    { name: 'Feb', predictions: 0, accuracy: 0 },
    { name: 'Mar', predictions: 0, accuracy: 0 },
    { name: 'Abr', predictions: 0, accuracy: 0 },
    { name: 'May', predictions: 0, accuracy: 0 },
    { name: 'Jun', predictions: 0, accuracy: 0 },
  ];

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido, {currentUser?.name}. Aquí tienes un resumen de la actividad reciente.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Predicciones Totales"
            value={loading ? "..." : totalPredictions.toString()}
            icon={<Image size={18} />}
            trend={{
              value: 12,
              isPositive: true,
            }}
          />
          <StatsCard
            title="Precisión Media"
            value={loading ? "..." : `${averageAccuracy}%`}
            icon={<LineChartIcon size={18} />}
            trend={{
              value: 3,
              isPositive: true,
            }}
          />
          <StatsCard
            title="Tiempo Medio de Análisis"
            value={averageAnalysisTime}
            icon={<Clock size={18} />}
            trend={{
              value: 8,
              isPositive: true,
            }}
          />
          {isAdmin && (
            <StatsCard
              title="Usuarios Totales"
              value="24"
              icon={<Users size={18} />}
              trend={{
                value: 5,
                isPositive: true,
              }}
            />
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="analytics">Análisis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Predicciones por Mes</CardTitle>
                <CardDescription>
                  Número total de predicciones realizadas en los últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="predictions" name="Predicciones" fill="hsl(var(--primary))" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Precisión del Modelo</CardTitle>
                <CardDescription>
                  Evolución de la precisión del modelo en los últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2} 
                      name="Precisión (%)" 
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
