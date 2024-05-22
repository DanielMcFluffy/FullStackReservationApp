import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

import { jwtDecode } from 'jwt-decode';
import { Observable, of, throwError } from 'rxjs';
import { AuthData } from './models/auth';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  apiUrl: string = 'https://localhost:7066';

  //success/error message for UI
  successMessage = signal(false);
  errorMessage = signal(false);
  usernameExistError = signal(false);

  username = this.tokenService.getToken()
    ? jwtDecode<{ username: string }>(this.tokenService.getToken() as string)
        .username
    : null;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  registerAccount(username: string, password: string): Observable<void> {
    // console.log({username, password})
    return this.http.post<void>(this.apiUrl + '/register', {
      username,
      password,
    });
  }

  registerThirdPartyAccount(
    username: string,
    uid: string
  ): Observable<AuthData> {
    return this.http.post<AuthData>(this.apiUrl + '/login_third-party', {
      username,
      uid,
    });
  }

  loginAccount(username: string, password: string): Observable<AuthData> {
    return this.http.post<AuthData>(this.apiUrl + '/login', {
      username,
      password,
    });
  }

  logoutAccount() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
