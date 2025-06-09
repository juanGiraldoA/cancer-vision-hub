
export interface User {
  id: number;
  cc: string;
  email: string;
  role: 'ADMIN' | 'DEV' | 'MED';
  name?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
}
