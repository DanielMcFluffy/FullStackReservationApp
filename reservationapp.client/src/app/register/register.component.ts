import { Component, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from '../shared/accounts.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnDestroy {
  //success/error message for UI
  successMessage = this.accountsService.successMessage;
  errorMessage = this.accountsService.errorMessage;
  usernameExistError = this.accountsService.usernameExistError;

  //create an instance of FormGroup
  registerForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private accountsService: AccountsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  //hides the alert messages after closing the component(modal)
  ngOnDestroy(): void {
    this.accountsService.successMessage.set(false);
    this.accountsService.errorMessage.set(false);
    this.accountsService.usernameExistError.set(false);
  }

  onRegister() {
    if (this.registerForm.valid) {
      //extract the value out from form
      const { email, password } = this.registerForm.value;

      this.accountsService.errorMessage.set(false);
      this.accountsService.usernameExistError.set(false);

      this.accountsService.registerAccount(email, password).subscribe(
        () => {
          this.successMessage.set(true);
          // console.log('Account created successfully');
          setTimeout(() => {
            this.dialog.closeAll();
          }, 1000);
        },
        (error) => {
          // console.error('Error creating account:', error);
          if (error.status === 400) this.usernameExistError.set(true);
        }
      );
    } else if (this.registerForm.invalid) {
      this.errorMessage.set(true);
    }
  }
}
