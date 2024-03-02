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
  checkoutForm: FormGroup

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<PersonaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { info: Alumno, isAdd: boolean }) {
    this.checkoutForm = this.formBuilder.group({
      id: [this.data.isAdd ? '' : this.data.info.id, [Validators.required]],
      nombre: [this.data.isAdd ? '' : this.data.info.nombre, [Validators.required]],
      image: [null]
    })

    if (!this.data.isAdd) {
      this.checkoutForm.get('id')?.disable()
    }
  }

  onSubmit(): void {
    const alumno: Alumno = {
      id: this.id?.value,
      nombre: this.nombre?.value,
      imagen: this.image?.value,
    }
    this.checkoutForm.reset()
    this.dialogRef.close(alumno)
  }

  get id() {
    return this.checkoutForm.get('id')
  }

  get nombre() {
    return this.checkoutForm.get('nombre')
  }

  get image() {
    return this.checkoutForm.get('image')
  }

  cancelClick(): void {
    this.dialogRef.close(false)
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]
    this.checkoutForm.patchValue({ image: file })
  }

}