import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Alumno } from 'src/app/models/Alumno';

@Component({
  selector: 'app-persona-form',
  templateUrl: './persona-form.component.html',
  styleUrls: ['./persona-form.component.scss']
})
export class PersonaFormComponent {
  checkoutForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PersonaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { info: Alumno, isAdd: boolean }
  ) {
    this.checkoutForm = this.formBuilder.group({
      id: [this.data.isAdd ? '' : this.data.info.id, [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      nombre: [this.data.isAdd ? '' : this.data.info.nombre, [Validators.required]],
      imagen: [null],
    });

    if (!this.data.isAdd) {
      this.checkoutForm.get('id')?.disable();
    }
  }

  onSubmit(): void {
    const alumno: Alumno = {
      id: this.id?.value,
      imagen: this.imagen?.value,
      nombre: this.nombre?.value,
    };
    this.checkoutForm.reset();
    this.dialogRef.close(alumno);
  }

  get id() {
    return this.checkoutForm.get('id');
  }

  get imagen() {
    return this.checkoutForm.get('imagen');
  }

  get nombre() {
    return this.checkoutForm.get('nombre');
  }

  cancelClick(): void {
    this.dialogRef.close(false);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.checkoutForm.patchValue({ image: file });
  }

}
