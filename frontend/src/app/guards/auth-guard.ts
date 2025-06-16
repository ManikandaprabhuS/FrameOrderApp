import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

interface JwtPayload {
  exp: number;
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // ✅ SSR-safe check
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');
    console.log('🔐 Token found:', token);

    if (token && token.split('.').length === 3) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        console.log('🔍 Decoded token:', decoded);

        const now = Date.now() / 1000;
        if (decoded.exp > now) {
          console.log('✅ Token is valid. Access granted.');
          return true;
        } else {
          console.warn('⛔ Token expired.');
        }
      } catch (error) {
        console.error('❌ Error decoding token:', error);
      }
    } else {
      console.warn('⚠️ Invalid or malformed token structure.');
    }

    // Clean up invalid token
    localStorage.removeItem('token');
  } else {
    console.warn('🚫 Not in browser environment');
  }
  console.log('✅ Navigated to Login Page');
  router.navigate(['admin/login']);
  return false;
};

