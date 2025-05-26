
const BASE_URL = 'http://127.0.0.1:8000/api';

export interface PredictionResult {
  diagnostico: string;
  region_afectada: string;
}

export interface Prediction {
  id: number;
  resultado: PredictionResult;
  confidence_score: number;
  fecha: string;
  usuario: number;
  usuario_email: string;
  imagen: number;
}

export interface CreatePredictionData {
  resultado: PredictionResult;
  confidence_score: number;
  imagen: number;
}

export const predictionService = {
  async createPrediction(data: CreatePredictionData, token: string): Promise<Prediction> {
    const response = await fetch(`${BASE_URL}/predicciones/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create prediction');
    }

    return response.json();
  },

  async getPredictions(token: string): Promise<Prediction[]> {
    const response = await fetch(`${BASE_URL}/predicciones/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch predictions');
    }

    return response.json();
  },
};
