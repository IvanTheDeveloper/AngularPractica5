import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly COOKIE_KEY = 'my_auth_token';

  constructor(private cookieService: CookieService) { }

  login(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  }

  logout() {
    this.cookieService.delete(this.COOKIE_KEY);
    return firebase.auth().signOut()
  }

  isAuthenticated() {
    return firebase.auth().currentUser !== null
  }

  getToken(): void {
    const currentUser = firebase.auth().currentUser
    if (currentUser) {
      currentUser.getIdToken().then(
        (token) => { this.cookieService.set(this.COOKIE_KEY, token) }
      ).catch(
        () => console.log('No se pudo recuperar el token')
      )
    }
  }

  registerNewUser(email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
  }

}