import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const required = route.data?.['role'] as string | undefined;
  if (required && auth.getRole() !== required) {
    const role = auth.getRole();
    if (role === 'PATIENT') router.navigate(['/patient/dashboard']);
    else if (role === 'DOCTOR') router.navigate(['/doctor/dashboard']);
    else router.navigate(['/login']);
    return false;
  }

  return true;
};
