import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  user_id: string;
  role?: string;
  is_active?: boolean;
  [key: string]: any;
}

const publicRoutes = [
  '/login',
  '/forgot-password',
  '/contact-support',
  '/server-unreachable',
  '/unauthorized',
  '/account-suspended',
  '/api/health',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/token/refresh',
];

const roleRoutes = {
  admin: ['/admin'],
  supervisor: ['/supervisor'],
  salesperson: ['/sales'],
};

const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

const checkServerHealth = async (): Promise<{ healthy: boolean; maintenanceInfo?: any }> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiUrl) return { healthy: false };

    const response = await fetch(`${apiUrl}api/health/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000), 
    });

    if (response.status === 503) {
      const maintenanceInfo = await response.json();
      return { 
        healthy: false, 
        maintenanceInfo: maintenanceInfo.maintenance || maintenanceInfo 
      };
    }

    return { healthy: response.ok };
  } catch (error) {
    console.warn('Server health check failed:', error);
    return { healthy: false };
  }
};

const validateUserToken = async (token: string): Promise<{ valid: boolean; user?: any; error?: string }> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiUrl) {
      return { valid: false, error: 'API_URL_MISSING' };
    }

    const response = await fetch(`${apiUrl}api/users/me/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const user = await response.json();
      return { valid: true, user };
    } else if (response.status === 401) {
      return { valid: false, error: 'UNAUTHORIZED' };
    } else {
      return { valid: false, error: 'SERVER_ERROR' };
    }
  } catch (error: any) {
    if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
      return { valid: false, error: 'SERVER_UNREACHABLE' };
    }
    return { valid: false, error: 'NETWORK_ERROR' };
  }
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }


  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  if (isPublicRoute) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (!accessToken && !refreshToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (accessToken && isTokenValid(accessToken)) {
    try {
      const validation = await validateUserToken(accessToken);

      if (validation.error === 'SERVER_UNREACHABLE' || validation.error === 'NETWORK_ERROR') {

        const response = NextResponse.next();
        response.headers.set('X-Server-Status', 'unreachable');
        response.headers.set('X-Offline-Mode', 'true');
        return response;
      }

      if (validation.error === 'UNAUTHORIZED') {
        // Clear invalid tokens
        const response = NextResponse.redirect(new URL('/unauthorized', request.url));
        response.cookies.delete('access_token');
        response.cookies.delete('refresh_token');
        response.cookies.delete('user_info');
        return response;
      }

      if (!validation.valid) {
        // Other server errors - try refresh token or redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('error', 'session_expired');
        return NextResponse.redirect(loginUrl);
      }

      const user = validation.user;

      // Check if user account is suspended/inactive
      if (!user.is_active) {
        const suspendedUrl = new URL('/account-suspended', request.url);
        suspendedUrl.searchParams.set('reason', 'inactive');
        return suspendedUrl;
      }

      // Check role-based access
      const userRole = user.role?.toLowerCase();
      if (userRole) {
        const allowedRoutes = roleRoutes[userRole as keyof typeof roleRoutes];
        const hasAccess = allowedRoutes?.some(route => pathname.startsWith(route));

        if (!hasAccess) {
          // Redirect to user's correct dashboard
          const correctPath = userRole === 'admin' ? '/admin' : 
                             userRole === 'supervisor' ? '/supervisor' : '/sales';
          
          if (pathname !== correctPath && !pathname.startsWith(correctPath)) {
            return NextResponse.redirect(new URL(correctPath, request.url));
          }
        }
      }

      // Add user info to headers for the app to use
      const response = NextResponse.next();
      response.headers.set('X-User-Role', user.role);
      response.headers.set('X-User-Active', user.is_active.toString());
      response.headers.set('X-Server-Status', 'reachable');
      return response;

    } catch (error) {
      // Network error - check if server is reachable or in maintenance
      const serverStatus = await checkServerHealth();
      
      if (!serverStatus.healthy) {
        if (serverStatus.maintenanceInfo) {
          // Server is in maintenance mode
          const maintenanceUrl = new URL('/maintenance', request.url);
          maintenanceUrl.searchParams.set('info', JSON.stringify(serverStatus.maintenanceInfo));
          return NextResponse.redirect(maintenanceUrl);
        } else {
          // Server unreachable but token is valid - allow limited access
          const response = NextResponse.next();
          response.headers.set('X-Server-Status', 'unreachable');
          response.headers.set('X-Offline-Mode', 'true');
          return response;
        }
      }

      // Other errors - redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'validation_failed');
      return NextResponse.redirect(loginUrl);
    }
  }

  // Try refresh token if access token is invalid/expired
  if (refreshToken && isTokenValid(refreshToken)) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${apiUrl}api/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.tokens?.access) {
          // Set new access token and continue
          const nextResponse = NextResponse.next();
          nextResponse.cookies.set('access_token', data.tokens.access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 2 * 60 * 60, // 2 hours
          });
          return nextResponse;
        }
      }
    } catch (error) {
      // Refresh failed, redirect to login
    }
  }

  // All token validation failed - redirect to login
  const response = NextResponse.redirect(new URL('/login', request.url));
  response.cookies.delete('access_token');
  response.cookies.delete('refresh_token');
  response.cookies.delete('user_info');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}