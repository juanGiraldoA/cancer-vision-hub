
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
      return data.map((user: any) => {
        // Map the role correctly - convert from role ID or null to string
        let roleString = 'USER'; // Default role
        if (user.role === 1) {
          roleString = 'ADMIN';
        }
        
        return {
          id: user.id,
          name: user.username || '',
          email: user.email || '',
          cc: user.cc || '', 
          role: roleString,
          status: user.is_active ? 'active' : 'inactive', // Map is_active boolean to our status string
          createdAt: user.created_at || new Date().toISOString(),
        };
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async createUser(user: Omit<User, 'id'>, token: string): Promise<User> {
    // Transform our User object to match what the API expects
    const apiUser = {
      cc: user.cc,
      email: user.email,
      role: user.role === 'ADMIN' ? 1 : null, // Convert role string to ID
      is_active: user.status === 'active',
      // Add other fields if needed
    };

    const response = await fetch(`${BASE_URL}/usuarios/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiUser),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    // Convert the API response back to our User format
    const data = await response.json();
    return {
      id: data.id,
      name: data.username || '',
      email: data.email,
      cc: data.cc,
      role: data.role === 1 ? 'ADMIN' : 'USER',
      status: data.is_active ? 'active' : 'inactive',
      createdAt: data.created_at || new Date().toISOString(),
    };
  },

  async updateUser(id: number, user: Partial<User>, token: string): Promise<User> {
    // Transform our User object to match what the API expects
    const apiUser: any = {};
    
    if (user.cc !== undefined) apiUser.cc = user.cc;
    if (user.email !== undefined) apiUser.email = user.email;
    if (user.role !== undefined) apiUser.role = user.role === 'ADMIN' ? 1 : null;
    if (user.status !== undefined) apiUser.is_active = user.status === 'active';
    
    const response = await fetch(`${BASE_URL}/usuarios/${id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiUser),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    // Convert the API response back to our User format
    const data = await response.json();
    return {
      id: data.id,
      name: data.username || '',
      email: data.email,
      cc: data.cc,
      role: data.role === 1 ? 'ADMIN' : 'USER',
      status: data.is_active ? 'active' : 'inactive',
      createdAt: data.created_at || new Date().toISOString(),
    };
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
