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
  progressBar: boolean = false
  fieldForm: FormGroup
  hidePassword: boolean = true
  passwordError: string = ''

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.fieldForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]]
    });
  }

  isInvalidEmail() {
    const email = this.fieldForm.get('email')
    return email?.invalid && (email?.dirty || email?.touched)
  }

  isInvalidPassword() {
    const password = this.fieldForm.get('password')
    this.passwordError = 'La contraseña debe tener entre 8 y 30 caracteres'
    return password?.invalid && (password?.dirty || password?.touched)
  }

  onSubmit() {
    if (this.fieldForm.valid) {
      const email = this.fieldForm.get('email')?.value;
      const password = this.fieldForm.get('password')?.value;
      this.auth.login(email, password).then(
        () => {
          this.LoginActions()
        }
      ).catch(
        error => {
          const errorMessage = error.code == 'auth/invalid-credential' ? 'credenciales inválidas' : 'desconocido'
          this.openSnackBar("Error al iniciar sesión: " + errorMessage)
        }
      )
    }
  }

  async LoginActions() {
    this.progressBar = true
    this.auth.updateCookieToken()
    await new Promise(f => setTimeout(f, 1000))
    this.router.navigateByUrl('/main')
    this.openSnackBar("Bienvenido " + this.auth.getUsername())
  }

  loginGoogle() {
    this.auth.loginWithGoogle().then(
      () => {
        this.LoginActions()
      }
    ).catch(
      error => {
        const test = error.code == 'auth/cancelled-popup-request' || error.code == 'auth/popup-closed-by-user'
        test ? '' : this.openSnackBar('Error al iniciar sesión con google')
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