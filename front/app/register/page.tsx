import { RegisterClient } from '@/components/register-client';
import { AUTH_CAROUSEL_SLIDES } from '@/constants/carousel';

export const dynamic = 'force-dynamic';

const RegistrationPage = () => <RegisterClient slides={AUTH_CAROUSEL_SLIDES} />;

export default RegistrationPage;
