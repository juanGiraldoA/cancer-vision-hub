
import { User } from '@/types/user';

const BASE_URL = 'http://127.0.0.1:8000/api';

export const userService = {
  async getUsers(token: string): Promise<User[]> {
    const response = await fetch(`${BASE_URL}/usuarios/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    return response.json();
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
