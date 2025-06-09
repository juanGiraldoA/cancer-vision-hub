
const BASE_URL = 'http://localhost:8000/api';

export interface PredictionResult {
  diagnostico: string;
  precision: number;
  recall: number;
  accuracy: number;
}

export interface Prediction {
  id: number;
  resultado: PredictionResult;
  confidence_score: number;
  fecha: string;
  usuario: number;
  usuario_email: string;
  imagen: number;
  imagen_id: number;
  imagen_url: string;
}

export interface CreatePredictionData {
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
      const errorData = await response.text();
      throw new Error(`Failed to create prediction: ${errorData}`);
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
      const errorData = await response.text();
      throw new Error(`Failed to fetch predictions: ${errorData}`);
    }

    return response.json();
  },
};
