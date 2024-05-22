import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { TokenService } from './token.service';

export const activateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const token = tokenService.getToken();

  if (token && !tokenService.isTokenExpired(token)) {
    return true;
  } else {
    router.navigate(['/login']);
    console.log(token);
    console.log(token && !tokenService.isTokenExpired(token));
    return false;
  }
};
