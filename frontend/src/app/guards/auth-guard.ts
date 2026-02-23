import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);
  if (typeof window === 'undefined') {
    return false;
  }

  const token = auth.getToken();
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const userRole = auth.getUserRole();
  const allowedRoles = route.data?.['roles'] as string[];

  if (allowedRoles && !allowedRoles.includes(userRole!)) {
    alert('Access Denied');
    router.navigate(['/login']);
    return false;
  }

  return true;
};
