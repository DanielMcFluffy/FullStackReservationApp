import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { LoginAuth } from './models/auth';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  apiUrl: string =
    'https://localhost:7066';

  //success/error message for UI
  successMessage = signal(false);
  errorMessage = signal(false);
  usernameExistError = signal(false);

  username = this.getToken()
    ? jwtDecode<{ username: string }>(this.getToken() as string).username
    : null;

  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  registerAccount(username: string, password: string): Observable<void> {
    // console.log({username, password})
    return this.http.post<void>(this.apiUrl + '/signup', {
      username,
      password,
    });
  }

  registerThirdPartyAccount(
    username: string,
    uid: string
  ): Observable<LoginAuth> {
    return this.http.post<LoginAuth>(this.apiUrl + '/login_third-party', {
      username,
      uid,
    });
  }

  loginAccount(username: string, password: string): Observable<LoginAuth> {
    return this.http.post<LoginAuth>(this.apiUrl + '/login', {
      username,
      password,
    });
  }

  requestRefreshToken(
    refreshToken: string
  ): Observable<{ auth: boolean; token: string }> {
    return this.http.post<{ auth: boolean; token: string }>(
      this.apiUrl + '/refresh_token',
      { refreshToken }
    );
  }

  logoutAccount() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
