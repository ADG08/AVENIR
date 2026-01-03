'use client';

import { ErrorClient } from '@/components/error-client';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    return <ErrorClient error={error} reset={reset} />;
}
