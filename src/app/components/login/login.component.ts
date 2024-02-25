import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private login: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]]
    });
  }
  
  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      this.login.login(email, password).then(
        () => {
          this.login.getToken()
          this.router.navigateByUrl('/main')
        }
      ).catch(
        error => {
          console.log(error)
          this.openSnackBar("error")
        }
      )
    }
  }

  loginGoogle() {
    this.login.loginWithGoogle().then(
      () => {
        this.login.getToken()
        this.router.navigateByUrl('/main')
      }
    ).catch(
      error => {
        console.log(error)
        this.openSnackBar("error")
      }
    )
  }

  openSnackBar(text: string) {
    this.snackBar.open(text, 'Ok', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

}