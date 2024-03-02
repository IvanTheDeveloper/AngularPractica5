import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/services/data.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonaFormComponent } from '../persona-form/persona-form.component';
import { UploadFileService } from 'src/app/services/upload-file.service';

@Component({
  selector: 'app-persona-list',
  templateUrl: './persona-list.component.html',
  styleUrls: ['./persona-list.component.scss']
})
export class PersonaListComponent {
  displayedColumns: string[] = ['id', 'nombre', 'accion']
  dataSource: MatTableDataSource<any>
  objectList: any[] = []

  constructor(private dataService: DataService, public dialog: MatDialog, private snackBar: MatSnackBar, private uploadFileService: UploadFileService) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.getObjectList()
    this.dataSource.data = this.objectList
  }

  addObject(): void {
    const dialogRef = this.dialog.open(PersonaFormComponent, {
      width: '500px',
      data: { isAdd: true, info: {} as any }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const filePath = `images/${Date.now()}_${result.image.name}`;
        this.uploadFileService.uploadFile(filePath, result.image).then(
          (imagePath) => {
            result.image = imagePath
            this.dataService.addObject(result).subscribe(
              (response) => {
                this.objectList.push(result)
                this.dataSource.data = this.objectList
                console.log("subido correctamente")
              },
              (error) => {
                console.log("No se pudo subir")
              }
            )
          }
        ).catch((error) => {
          console.log("Ha habido un error")
        })
      }
    });
  }

  editObject(obj: any): void {
    console.log(obj)
    const dialogRef = this.dialog.open(PersonaFormComponent, {
      width: '400px',
      data: { isAdd: false, info: obj },
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (result) {
        this.dataService.updateObject(result).subscribe(
          () => {
            let index = this.objectList.findIndex(p => p.id === result.id);
            if (index >= 0 && index < this.objectList.length) {
              this.objectList[index] = result;
              this.dataSource.data = this.objectList;
            }
            this.showSnackbar('actualizado correctamente', 'success-message')
          },
          () => {
            this.showSnackbar('no se pudo editar', 'error-message')
          }
        )
      }
    });
  }

  removeObject(obj: any): void {
    let objName = obj.nombre;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { objName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteObject(obj.id).subscribe(
          (result) => {
            this.uploadFileService.deleteFile(obj.image).then(
              () => {
                this.showSnackbar('eliminado correctamente', 'success-message')
                let index = this.objectList.findIndex(p => p.id === obj.id);
                if (index >= 0 && index < this.objectList.length) {
                  this.objectList.splice(index, 1);
                }
                this.dataSource.data = this.objectList;
              }
            ).catch()
          },
          (error) => {
            this.showSnackbar('no se pudo eliminar', 'error-message');
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

  saveObjectList() {
    let objectDictionary: { [id: string]: any } = {};
    this.objectList.forEach(p => {
      objectDictionary[p.id] = p;
    });
    console.log(objectDictionary)
    this.dataService.saveObjectList(objectDictionary).subscribe(
      (response) => {
        console.log("Los datos se han guardado correctamente");
      },
      (error) => {
        console.log(error)
      }
    )
  }

  getObjectList() {
    this.dataService.getObjectList().subscribe(
      (response) => {
        let list: any[] = Object.values(response)
        this.dataSource.data = list
        this.objectList = list
      },
      (error) => {
        console.log(error);
      }
    )
  }

}