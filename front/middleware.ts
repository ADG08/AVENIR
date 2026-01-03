import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDashboardRouteByRole } from './lib/dashboard-routes';
import type { UserRole } from '@/types/enums';

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const isAuthenticated = !!accessToken;

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isProtectedPage = pathname.startsWith('/dashboard');

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

  if (!isAuthenticated && isProtectedPage) {
    return NextResponse.redirect(new URL('/login', request.url));
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
