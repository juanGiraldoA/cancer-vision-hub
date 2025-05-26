
const BASE_URL = 'http://127.0.0.1:8000/api';

export interface Training {
  id: number;
  fecha: string;
  archivo: string;
  usuario: number;
  usuario_email: string;
}

export const trainingService = {
  async uploadTrainingFile(file: File, token: string): Promise<Training> {
    const formData = new FormData();
    formData.append('archivo', file);

    const response = await fetch(`${BASE_URL}/entrenamientos/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload training file');
    }

    return response.json();
  },

  async getTrainingFiles(token: string): Promise<Training[]> {
    const response = await fetch(`${BASE_URL}/entrenamientos/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch training files');
    }

    return response.json();
  },
};
