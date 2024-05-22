import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TokenService } from '../token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  token: string | null;

  constructor(private tokenService: TokenService) {
    this.token = this.tokenService.getToken();
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${this.token}`), //this will pass in the authorization bearer to our endpoint
    });
    console.log('before next.handle', this.token!);
    return next.handle(modifiedReq);
  }
}
