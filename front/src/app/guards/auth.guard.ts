import { AuthService } from './../services/auth.service';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (!authService.isLoggedIn.value) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

export const LoginGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (authService.isLoggedIn.value) {
    router.navigate(['/home']);
    return false;
  }

  return true;
}
