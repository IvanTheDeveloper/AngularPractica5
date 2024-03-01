import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { firebaseConfig } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly COOKIE_KEY = 'my_auth_token'
  private firebaseUrl = firebaseConfig.databaseURL
  private firebaseFolder = 'alumnos'

  private objList!: any[]

  constructor(private cookieService: CookieService, private http: HttpClient) { }

  refreshObjList(obj: any): any[] {
    const index = this.objList.findIndex(parameter => parameter.id === obj.id)
    if (index >= 0 && index < this.objList.length) {
      this.objList[index] = obj;
    }
    return this.objList;
  }

  updateObj(obj: any) {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.put(this.firebaseUrl + '/' + this.firebaseFolder + '/' + obj.id + '.json?auth=' + token, obj);
  }

  saveObjList(objList: any): Observable<any> { //objList must be a dictionary (key-value)
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.put(this.firebaseUrl + '/' + this.firebaseFolder + '.json?auth=' + token, objList);
  }

  getObjList(): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.get(this.firebaseUrl + '/' + this.firebaseFolder + '.json?auth=' + token);
  }

  addObj(obj: any): Observable<any> {
    const token = this.cookieService.get(this.COOKIE_KEY)
    return this.http.put(this.firebaseUrl + '/' + this.firebaseFolder + '/' + obj.id + '.json?auth=' + token, obj);
  }

  deleteObj(id: string) {
    const token = this.cookieService.get(this.COOKIE_KEY)
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    }
    return this.http.delete(this.firebaseUrl + '/' + this.firebaseFolder + '/' + id + '.json?auth=' + token, httpOptions)
  }

}