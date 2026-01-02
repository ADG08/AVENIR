const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface CheckClientAdvisorResponse {
  isManaged: boolean;
  advisorId: string | null;
  advisorName: string | null;
}

export const checkClientAdvisor = async (
  clientId: string,
  advisorId: string
): Promise<CheckClientAdvisorResponse> => {
  const response = await fetch(
    `${API_URL}/api/advisors/${advisorId}/clients/${clientId}/check`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || 'Failed to check client advisor');
  }

  return response.json();
};
