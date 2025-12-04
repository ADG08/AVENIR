'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * Provider React Query pour l'application
 *
 * Note: Le Provider tRPC est temporairement désactivé jusqu'à ce que le backend soit configuré.
 * Une fois le backend tRPC configuré, ce provider sera mis à jour pour inclure tRPC.
 */
export const TRPCProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

