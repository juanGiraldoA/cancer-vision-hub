
export interface User {
  id: number;
  cc: string;
  email: string;
  role: string;
  name?: string;
  status: 'active' | 'inactive';
  createdAt?: string; // Added this property to match UserTable expectations
}
