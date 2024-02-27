import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';
import { Alumno } from '../models/Alumno';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly COOKIE_KEY = 'my_auth_token'
  private alumnos: Alumno[] = [
    new Alumno('1234', 'carlos', 'hola'),
    new Alumno('1298', 'pepe', 'sdsdfdsf'),
  ]
  private firebaseUrl = 'https://interfacespractica5-default-rtdb.europe-west1.firebasedatabase.app';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  refreshAlumno(alumno: Alumno): Alumno[] {
    const index = this.alumnos.findIndex(pr => pr.id === alumno.id)
    if (index >= 0 && index < this.alumnos.length) {
      this.alumnos[index] = alumno;
    }
    return this.alumnos;
  }

  updateAlumno(alumno: Alumno) {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.put(this.firebaseUrl + '/alumnos/' + alumno.id + '.json?auth=' + token, alumno);
  }

  saveAlumnos(data: any): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.put(this.firebaseUrl + '/alumnos.json?auth=' + token, data);
  }

  getAlumnos(): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.get(this.firebaseUrl + '/alumnos.json?auth=' + token);
  }

  addAlumno(alumno: Alumno): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.put(this.firebaseUrl + '/alumnos/' + alumno.id + '.json?auth=' + token, alumno);
  }

  deleteAlumno(id: string) {
    const token = this.cookieService.get(this.COOKIE_KEY)
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    }
    return this.http.delete(this.firebaseUrl + '/alumnos/' + id + '.json?auth=' + token, httpOptions)
  }

}