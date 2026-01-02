import { Suspense } from 'react';
import { LandingClient } from '@/components/landing-client';
import { LandingLoading } from '@/components/landing-loading';
import { fetchAuthStatus } from '@/lib/auth-api';

export const dynamic = 'force-dynamic';

const LandingContent = async () => {
  const authStatus = await fetchAuthStatus();
  return <LandingClient initialAuth={authStatus} />;
};

export default function Home() {
  return (
    <Suspense fallback={<LandingLoading />}>
      <LandingContent />
    </Suspense>
  );
}
