import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDashboardRouteByRole } from './lib/dashboard-routes';
import type { UserRole } from '@/types/enums';

const ROUTES_WHITELIST: Record<UserRole, string[]> = {
  CLIENT: [
    '/dashboard',
    '/dashboard/investment',
    '/dashboard/loans',
    '/dashboard/contact',
  ],
  ADVISOR: [
    '/dashboard/clients',
    '/dashboard/news',
    '/dashboard/contact',
  ],
  DIRECTOR: [
    '/dashboard/investment',
    '/dashboard/clients',
    '/dashboard/contact',
  ],
};

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/verify-email',
  '/not-found',
  '/error',
];

async function getUserRole(accessToken: string): Promise<UserRole | null> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        'Cookie': `accessToken=${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data?.user?.role || null;
  } catch {
    return null;
  }
}

function isRouteAllowed(pathname: string, role: UserRole | null): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true;
  }

  if (!role) {
    return false;
  }

  const allowedRoutes = ROUTES_WHITELIST[role] || [];
  return allowedRoutes.includes(pathname);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const isAuthenticated = !!accessToken;

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (isAuthenticated && isAuthPage) {
    const role = await getUserRole(accessToken);
    const dashboardRoute = role ? getDashboardRouteByRole(role) : '/dashboard';
    return NextResponse.redirect(new URL(dashboardRoute, request.url));
  }

  if (isAuthenticated && pathname === '/dashboard') {
    const role = await getUserRole(accessToken);
    if (role && role !== 'CLIENT') {
      const dashboardRoute = getDashboardRouteByRole(role);
      return NextResponse.redirect(new URL(dashboardRoute, request.url));
    }
  }

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const role = await getUserRole(accessToken);
  if (!isRouteAllowed(pathname, role)) {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
