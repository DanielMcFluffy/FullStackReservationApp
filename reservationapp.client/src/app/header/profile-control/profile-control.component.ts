import { Component, DoCheck, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../login/login.component';
import { AccountsService } from '../../shared/accounts.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { TokenService } from '../../shared/token.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile-control',
  templateUrl: './profile-control.component.html',
  styleUrl: './profile-control.component.css',
})
export class ProfileControlComponent implements  DoCheck {
  constructor(
    private dialog: MatDialog,
    private accountsService: AccountsService,
    private tokenService: TokenService,
    private router: Router,
    private location: Location,
  ) {}

  //properties to store localStorage for conditional rendering
  token?: string | null;
  tokenExpired?: boolean;

  //username property
  username?: string;

  // ngOnInit(): void {
  //   this.token = this.tokenService.getToken();

  //   if (this.token) {
  //     const { email } = jwtDecode<{ email: string }>(this.token);
  //     this.username = email;
  //   }
  // }

  ngDoCheck(): void {
    this.token = this.tokenService.getToken();
    this.tokenExpired = this.tokenService.isTokenExpired(this.token);
    if (this.token && !this.tokenExpired) {
      const { email } = jwtDecode<{ email: string }>(this.token);
      this.username = email;
    }
  }

  onLogin() {
    const loginRef = this.dialog.open(LoginComponent, {});

    loginRef.afterClosed().subscribe(() => {

      if (this.token) {
        const { username } = jwtDecode<{ username: string }>(this.token);
        this.username = username;
      }
    });
    // this.token = localStorage.getItem('accessToken');
    // console.log(this.token);
  }

  onLogout() {
    this.accountsService.logoutAccount()
    this.token = this.tokenService.getToken();
    (this.location.path().includes('/listing') || this.location.path().includes('/landing')) ? 
    undefined :
    this.router.navigate(['/login']);
  }
}
