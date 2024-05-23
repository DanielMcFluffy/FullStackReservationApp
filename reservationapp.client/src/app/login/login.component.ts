import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { AccountsService } from '../shared/accounts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { TokenService } from '../shared/token.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  //create an instance of FormGroup
  loginForm: FormGroup = new FormGroup({});

  //success/error message for UI
  successMessage = this.accountsService.successMessage;
  errorMessage = this.accountsService.errorMessage;
  mustSignInMessage = this.accountsService.mustSignInError;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private accountsService: AccountsService,
    private tokenService: TokenService,
    private router: Router,
    private authService: AuthService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  //hides the alert messages after closing the component(modal)
  ngOnDestroy(): void {
    this.accountsService.successMessage.set(false);
    this.accountsService.errorMessage.set(false);
    this.accountsService.usernameExistError.set(false);
    this.accountsService.mustSignInError.set(false);
  }

  openDialog() {
    const dialogRef = this.dialog.open(RegisterComponent);

    dialogRef.afterClosed().subscribe(() => {
      console.log('opened');
    });
  }

  async handleGoogleSignIn() {
    try {
      await this.authService.loginGoogle(); // Wait for sign-in to complete
      if (this.tokenService.getToken()) {
        // Check token after sign-in completes
        this.successMessage.set(true);
        this.dialog.closeAll();
        console.log('closed');
      }
    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  }

  onLogin() {
    // //extract out email/password
    const { email, password } = this.loginForm.value;
    // //plug them in here
    this.accountsService.loginAccount(email, password).subscribe(
      (authData) => {
        // extract out auth and token
        const { token, refreshToken } = authData;
        console.log(authData);
        // set token in localstorage
        this.tokenService.setAccessToken(token!);
        this.tokenService.setRefreshToken(refreshToken!);
        this.tokenService.getToken();
        if (token && refreshToken) {
          this.successMessage.set(true);
        }
        setTimeout(() => {
          this.dialog.closeAll();
          console.log(this.location.path());
          this.location.path().includes('/login') ?
          this.router.navigate(['/landing']) :
          undefined;
          if(this.location.path().includes('/listing')) {
            const currentPath = this.location.path();
            this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
              this.router.navigateByUrl(currentPath);
          }); 
          }
          
        }, 800);
      },
      (error) => {
        console.log(error);
        this.errorMessage.set(true);
        setTimeout(() => {
          this.errorMessage.set(false);
        }, 1000);
      }
    );
  }
}
