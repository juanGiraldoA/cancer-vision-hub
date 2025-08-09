const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

interface RequestPasswordResetData {
  email: string;
}

interface ChangePasswordData {
  uidb64: string;
  token: string;
  nueva_password: string;
  confirmar_password: string;
}

export const authService = {
  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/login/recuperar/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Network error occurred');
    }
  },

  async validateResetToken(uidb64: string, token: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login/validar-token/${uidb64}/${token}/`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/login/cambiar-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to change password');
    }
  },
};