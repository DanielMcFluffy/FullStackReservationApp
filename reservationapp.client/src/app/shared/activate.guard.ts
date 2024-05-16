import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { AccountsService } from './accounts.service';

export const activateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const accountsService = inject(AccountsService);
  const router = inject(Router);

  const token = accountsService.getToken();

  if (token && !authService.isTokenExpired(token)) {
    return true;
  } else {
    router.navigate(['/login']);
    console.log(token);
    console.log(token && !authService.isTokenExpired(token));
    return false;
  }
};
