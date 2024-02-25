import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const mainGuard: CanActivateFn = (route, state) => {

  const login = inject(AuthService);
  const router = inject(Router);

  if (login.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }

}