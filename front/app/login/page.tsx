import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/forms/LoginForm';
import { AUTH_CAROUSEL_SLIDES } from '@/constants/carousel';

export const dynamic = 'force-dynamic';

const LoginPage = () => (
  <AuthLayout slides={AUTH_CAROUSEL_SLIDES}>
    <LoginForm />
  </AuthLayout>
);

export default LoginPage;
