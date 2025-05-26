
const BASE_URL = 'http://127.0.0.1:8000/api';

export interface MedicalImage {
  id: number;
  imagen: string;
  fecha_subida: string;
  subida_por: number;
  subida_por_email: string;
}

export const medicalImageService = {
  async uploadMedicalImage(file: File, token: string): Promise<MedicalImage> {
    const formData = new FormData();
    formData.append('imagen', file);

    const response = await fetch(`${BASE_URL}/imagenes/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload medical image');
    }

    return response.json();
  },

  async getMedicalImages(token: string): Promise<MedicalImage[]> {
    const response = await fetch(`${BASE_URL}/imagenes/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch medical images');
    }

    return response.json();
  },
};
