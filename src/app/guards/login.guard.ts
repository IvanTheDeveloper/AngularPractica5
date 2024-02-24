import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  
  const login = inject(AuthService);
  const router = inject(Router);

  if (login.isAuthenticated()) {
    router.navigate(['/main']);
    return false;
  } else {
    return true;
  }

};
