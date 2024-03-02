import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/services/data.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonaFormComponent } from '../persona-form/persona-form.component';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { Alumno } from 'src/app/models/Alumno';

@Component({
  selector: 'app-persona-list',
  templateUrl: './persona-list.component.html',
  styleUrls: ['./persona-list.component.scss']
})
export class PersonaListComponent {
  displayedColumns: string[] = ['id', 'nombre', 'accion']
  dataSource: MatTableDataSource<Alumno>
  alumnos: Alumno[] = []

  constructor(private personaService: DataService, public dialog: MatDialog, private snackBar: MatSnackBar, private uploadFileService: UploadFileService) {
    this.dataSource = new MatTableDataSource<Alumno>();
  }

  ngOnInit(): void {
    this.getPersonas();
    this.dataSource.data = this.alumnos;
  }

  addPersona(): void {
    const dialogRef = this.dialog.open(PersonaFormComponent, {
      width: '500px',
      data: { isAdd: true, info: {} as Alumno }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const filePath = `images/${Date.now()}_${result.image.name}`;
        this.uploadFileService.uploadFile(filePath, result.image).then(
          (imagePath) => {
            result.image = imagePath
            this.personaService.addObj(result).subscribe(
              (response) => {
                this.alumnos.push(result)
                this.dataSource.data = this.alumnos
                console.log("Persona subido correctamente")
              },
              (error) => {
                console.log("No se pudo subir la persona")
              }
            )
          }
        ).catch((error) => {
          console.log("Ha habido un error")
        })
      }
    });
  }

  editPersona(alumno: Alumno): void {
    console.log(alumno)
    const dialogRef = this.dialog.open(PersonaFormComponent, {
      width: '400px',
      data: { isAdd: false, info: alumno },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.personaService.updateObj(result).subscribe(
          () => {
            let index = this.alumnos.findIndex(p => p.id === result.id);
            if (index >= 0 && index < this.alumnos.length) {
              this.alumnos[index] = result;
              this.dataSource.data = this.alumnos;
            }
            this.showSnackbar('La persona se ha actualizado correctamente', 'success-message')
          },
          () => {
            this.showSnackbar('La persona no se pudo editar', 'error-message')
          }
        )
      }
    });
  }

  removePersona(alumno: Alumno): void {
    let nombreAlumno = alumno.nombre;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { nombreAlumno }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personaService.deleteObj(alumno.id).subscribe(
          (result) => {
            this.uploadFileService.deleteFile(alumno.imagen).then(
              () => {
                this.showSnackbar('La persona se ha eliminado correctamente', 'success-message')
                let index = this.alumnos.findIndex(p => p.id === alumno.id);
                if (index >= 0 && index < this.alumnos.length) {
                  this.alumnos.splice(index, 1);
                }
                this.dataSource.data = this.alumnos;
              }
            ).catch()
          },
          (error) => {
            this.showSnackbar('El producto no se pudo eliminar', 'error-message');
          }
        )
      }
    });
  }

  showSnackbar(mensaje: string, clase: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: [clase]
    });
  }

  savePersonas() {
    let personasDictionary: { [id: string]: Alumno } = {};
    this.alumnos.forEach(p => {
      personasDictionary[p.id] = p;
    });
    console.log(personasDictionary)
    this.personaService.saveObjList(personasDictionary).subscribe(
      (response) => {
        console.log("Los datos se han guardado correctamente");
      },
      (error) => {
        console.log(error)
      }
    )
  }

  getPersonas() {
    this.personaService.getObjList().subscribe(
      (response) => {
        let personas: Alumno[] = Object.values(response)
        this.dataSource.data = personas
        this.alumnos = personas
      },
      (error) => {
        console.log(error);
      }
    )
  }

}
