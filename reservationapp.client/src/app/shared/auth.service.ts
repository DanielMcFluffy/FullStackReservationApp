import { Injectable, inject } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import {
  GoogleAuthProvider,
  UserCredential,
  signInWithPopup,
} from 'firebase/auth';
import { AccountsService } from './accounts.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private firebaseAuth: Auth,
    private accountsService: AccountsService,
    private dialog: MatDialog
  ) {}

  // private checkAuthState(): void {
  //   onAuthStateChanged(this.firebaseAuth, (user) => {
  //     if (user) {
  //       // User is signed in.
  //       console.log('User is signed in', user);
  //       // Here, you can also set user data in your service or perform other actions
  //     } else {
  //       // User is signed out.
  //       console.log('User is signed out');
  //     }
  //   });
  // }

  //firebase logins

  //google
  loginGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.firebaseAuth, provider) // Return the promise directly
      .then(async (result: UserCredential) => {
        // Handle success, for example log user info or further processing
        console.log('Authentication successful, user:', result.user);
        // console.log(typeof result.user.uid)
        this.accountsService
          .registerThirdPartyAccount(
            String(result.user.email),
            String(result.user.uid)
          )
          .subscribe((authData) => {
            // TODO: not sure what to do with auth:boolean
            const { token, refreshToken } = authData;
            console.log(authData);

            localStorage.setItem('accessToken', token!);
            localStorage.setItem('refreshToken', refreshToken!);
            this.dialog.closeAll();
          });
        return result;
      })
      .catch((error) => {
        // Handle errors here
        console.error('Error during Google sign-in:', error);
        throw error; // Re-throw the error if you want to handle it in the component
      });
  }
}
