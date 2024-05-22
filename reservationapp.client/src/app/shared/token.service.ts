import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthData } from './models/auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  apiUrl: string = 'https://localhost:7066';

  constructor(private http: HttpClient, private router: Router) {}

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  requestAccessToken(): Observable<AuthData> {
    const refreshToken = this.getRefreshToken();
    if (this.isTokenExpired(refreshToken)) {
      return throwError('Refresh token is expired');
    }
    return this.http.get<AuthData>(this.apiUrl + '/access');
  }

  requestRefreshToken(): Observable<AuthData> {
    const accessToken = this.getToken();
    if (!this.isTokenExpired(accessToken)) {
      return this.http.get<AuthData>(this.apiUrl + '/refresh').pipe(
        catchError((error) => {
          console.error('Failed to refresh token', error);
          this.router.navigate(['/landing']);
          return throwError(error);
        })
      );
    }
    return throwError('Access token is expired');
  }

  isTokenExpired(token: string | null): boolean {
    try {
      const decoded: any = jwtDecode(token!);
      // console.log(decoded);
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      console.error('Failed to decode token', error);
      return true;
    }
  }
}
