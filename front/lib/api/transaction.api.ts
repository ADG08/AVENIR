import { TransactionType } from '@avenir/shared/enums';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api';

const clearAuthCookies = () => {
  if (typeof document !== 'undefined') {
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

const internalRefreshToken = async (): Promise<boolean> => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        clearAuthCookies();
        return false;
      }

      return true;
    } catch (error) {
      clearAuthCookies();
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const hasBody = options.body !== undefined && options.body !== null;
  const headers: HeadersInit = {
    ...(hasBody && { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (res.status === 401 && !url.includes('/auth/refresh')) {
    const refreshSuccess = await internalRefreshToken();

    if (refreshSuccess) {
      const hasBody = options.body !== undefined && options.body !== null;
      const retryHeaders: HeadersInit = {
        ...(hasBody && { 'Content-Type': 'application/json' }),
        ...options.headers,
      };

      const retryRes = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: retryHeaders,
      });

      if (!retryRes.ok) {
        const error = await retryRes.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || `Request failed with status ${retryRes.status}`);
      }

      return retryRes;
    } else {
      clearAuthCookies();
      throw new Error('Authentication failed. Please log in again.');
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `Request failed with status ${res.status}`);
  }

  return res;
};

export interface Transaction {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string | null;
  type: TransactionType;
  createdAt: string;
}

export interface GetTransactionsParams {
  accountId?: string;
}

export interface CreateTransactionRequest {
  fromAccountId: string;
  toAccountId?: string;
  amount: number;
  description?: string;
  type: TransactionType;
}

export const transactionApi = {
  async getTransactions(params?: GetTransactionsParams): Promise<Transaction[]> {
    const queryParams = new URLSearchParams();
    if (params?.accountId) {
      queryParams.append('accountId', params.accountId);
    }

    const url = `${API_BASE_URL}/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
    });

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  async createTransaction(request: CreateTransactionRequest): Promise<Transaction> {
    const response = await fetchWithAuth(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return response.json();
  },
};

