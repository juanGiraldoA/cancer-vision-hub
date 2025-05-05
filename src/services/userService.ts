import { User } from '@/types/user';

const BASE_URL = 'http://127.0.0.1:8000/api';

export const userService = {
  async getUsers(token: string): Promise<User[]> {
    try {
      console.log('Fetching users with token:', token);
      const response = await fetch(`${BASE_URL}/usuarios/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error('Error en la respuesta:', response.status, response.statusText);
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Users data received:', data);
      
      // Asegurar que la respuesta es un array
      if (!Array.isArray(data)) {
        console.error('La respuesta no es un array:', data);
        return [];
      }
      
      // Mapear los datos del backend a nuestro formato de User
      return data.map((user: any) => ({
        id: user.id,
        name: user.username || '',
        email: user.email || '',
        cc: user.cc || '', // Si el backend no envía cc, usamos string vacío
        role: user.role || 'USER',
        status: user.status || 'active', // Asumimos activo si no se especifica
        createdAt: user.created_at || new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async createUser(user: Omit<User, 'id'>, token: string): Promise<User> {
    const response = await fetch(`${BASE_URL}/usuarios/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    return response.json();
  },

  async updateUser(id: number, user: Partial<User>, token: string): Promise<User> {
    const response = await fetch(`${BASE_URL}/usuarios/${id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return response.json();
  },

  async deleteUser(id: number, token: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/usuarios/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  },
};
