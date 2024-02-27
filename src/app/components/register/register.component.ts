import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  progressBar: boolean = false
  fieldForm: FormGroup;
  hidePassword: boolean = true
  hideConfirmPassword: boolean = true
  passwordError: string = ''
  confirmPasswordError: string = ''

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private snackBar: MatSnackBar) {
    this.fieldForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]),
    }, {
      validators: this.validate('password', 'confirmPassword')
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

  isInvalidConfirmPassword() {
    const password = this.fieldForm.get('password')
    const confirmPassword = this.fieldForm.get('confirmPassword')
    password == confirmPassword ? this.confirmPasswordError = 'La contraseña debe tener entre 8 y 30 caracteres' : this.confirmPasswordError = 'Las contraseñas no coinciden'
    return confirmPassword?.invalid && (confirmPassword?.dirty || confirmPassword?.touched) && password !== confirmPassword
  }

  validate(controlName: string, matchingControlName: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if (matchingControl!.errors && !matchingControl!.errors?.['confirmedValidator']) {
        return null;
      }

      if (control!.value !== matchingControl!.value) {
        const error = { confirmedValidator: 'Passwords do not match.' };
        matchingControl!.setErrors(error);
        return error;
      } else {
        matchingControl!.setErrors(null);
        return null;
      }
    }
  }

  onSubmit(): void {
    if (this.fieldForm.valid) {
      const email = this.fieldForm.get('email')?.value;
      const password = this.fieldForm.get('password')?.value;
      this.auth.register(email, password).then(
        () => {
          this.LoginActions()
        }
      ).catch(
        error => {
          const errorMessage = error.code == 'auth/email-already-in-use' ? 'ya existe un usuario con ese correo' : 'desconocido'
          this.openSnackBar("Error al registrarse: " + errorMessage)
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

  openSnackBar(text: string) {
    this.snackBar.open(text, 'Ok', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

}