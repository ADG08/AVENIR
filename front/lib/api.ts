const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
  // Verify email and create session
  verifyEmail: async (token: string) => {
    const res = await fetch(`${API_URL}/api/verify-email?token=${token}`, {
      credentials: 'include', // IMPORTANT: sends cookies
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Get current authenticated user
  getCurrentUser: async () => {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      credentials: 'include',
    });
    if (!res.ok) {
      const error: any = new Error('Authentication failed');
      error.status = res.status;
      throw error;
    }
    return res.json();
  },

  // Logout
  logout: async () => {
    const res = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return res.json();
  },

  // Refresh token
  refreshToken: async () => {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) {
      const error: any = new Error('Token refresh failed');
      error.status = res.status;
      throw error;
    }
    return true;
  },
};
