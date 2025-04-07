
import React from 'react';
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

const chartData = [
  { name: 'Ene', predictions: 10, accuracy: 88 },
  { name: 'Feb', predictions: 15, accuracy: 91 },
  { name: 'Mar', predictions: 25, accuracy: 89 },
  { name: 'Abr', predictions: 18, accuracy: 94 },
  { name: 'May', predictions: 22, accuracy: 92 },
  { name: 'Jun', predictions: 30, accuracy: 95 },
];

const Dashboard = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

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
            value="130"
            icon={<Image size={18} />}
            trend={{
              value: 12,
              isPositive: true,
            }}
          />
          <StatsCard
            title="Precisión Media"
            value="92%"
            icon={<LineChartIcon size={18} />}
            trend={{
              value: 3,
              isPositive: true,
            }}
          />
          <StatsCard
            title="Tiempo Medio de Análisis"
            value="1.2s"
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
