const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface GetUsersParams {
  role?: string;
}

export const userApi = {
  async getUsers(params?: GetUsersParams) {
    const queryParams = new URLSearchParams();
    if (params?.role) {
      queryParams.append('role', params.role);
    }

    const response = await fetch(
      `${API_BASE_URL}/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  },

  async getUserById(userId: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  },
};
