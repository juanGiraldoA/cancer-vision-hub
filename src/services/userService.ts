
import { User } from '@/types/user';

const BASE_URL = 'http://localhost:8000/api';

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
      
      if (!Array.isArray(data)) {
        console.error('La respuesta no es un array:', data);
        return [];
      }
      
      return data.map((user: any) => {
        let roleString: 'ADMIN' | 'DEV' | 'MED' = 'MED'; // Default role
        if (user.role === 1) {
          roleString = 'ADMIN';
        } else if (user.role === 2) {
          roleString = 'DEV';
        } else if (user.role === 3) {
          roleString = 'MED';
        }
        
        return {
          id: user.id,
          name: user.username || '',
          email: user.email || '',
          cc: user.cc || '', 
          role: roleString,
          status: user.is_active ? 'active' : 'inactive',
          createdAt: user.created_at || new Date().toISOString(),
        };
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async createUser(user: Omit<User, 'id'>, token: string): Promise<User> {
    const getRoleNumber = (role: string) => {
      switch (role) {
        case 'ADMIN': return 1;
        case 'DEV': return 2;
        case 'MED': return 3;
        default: return 3;
      }
    };

    const apiUser = {
      cc: user.cc,
      email: user.email,
      password: "defaultPassword123", // You might want to handle this differently
      role: getRoleNumber(user.role),
      is_active: user.status === 'active',
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
      const errorData = await response.text();
      throw new Error(`Failed to create user: ${errorData}`);
    }

    const data = await response.json();
    let roleString: 'ADMIN' | 'DEV' | 'MED' = 'MED';
    if (data.role === 1) roleString = 'ADMIN';
    else if (data.role === 2) roleString = 'DEV';
    else if (data.role === 3) roleString = 'MED';

    return {
      id: data.id,
      name: data.username || '',
      email: data.email,
      cc: data.cc,
      role: roleString,
      status: data.is_active ? 'active' : 'inactive',
      createdAt: data.created_at || new Date().toISOString(),
    };
  },

  async updateUser(id: number, user: Partial<User>, token: string): Promise<User> {
    const getRoleNumber = (role: string) => {
      switch (role) {
        case 'ADMIN': return 1;
        case 'DEV': return 2;
        case 'MED': return 3;
        default: return 3;
      }
    };

    const apiUser: any = {};
    
    if (user.cc !== undefined) apiUser.cc = user.cc;
    if (user.email !== undefined) apiUser.email = user.email;
    if (user.role !== undefined) apiUser.role = getRoleNumber(user.role);
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
      const errorData = await response.text();
      throw new Error(`Failed to update user: ${errorData}`);
    }

    const data = await response.json();
    let roleString: 'ADMIN' | 'DEV' | 'MED' = 'MED';
    if (data.role === 1) roleString = 'ADMIN';
    else if (data.role === 2) roleString = 'DEV';
    else if (data.role === 3) roleString = 'MED';

    return {
      id: data.id,
      name: data.username || '',
      email: data.email,
      cc: data.cc,
      role: roleString,
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
      const errorData = await response.text();
      throw new Error(`Failed to delete user: ${errorData}`);
    }
  },
};
