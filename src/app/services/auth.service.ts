import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly COOKIE_KEY = 'my_auth_token';

  constructor(private auth: Auth, private cookieService: CookieService) { }

  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout(): Promise<void> {
    this.cookieService.delete(this.COOKIE_KEY);
    return signOut(this.auth)
  }

  isAuthenticated(): boolean {
    return this.cookieService.check(this.COOKIE_KEY)
  }

  updateCookieToken() {
    const currentUser = this.auth.currentUser
    if (currentUser) {
      currentUser.getIdToken().then(
        async (token) => { this.cookieService.set(this.COOKIE_KEY, token)
          await this.delay(1000)}
      ).catch(
        () => console.log('No se pudo recuperar el token')
      )
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms)); 
  }


  getUsername() {
    return this.auth.currentUser?.email //displayName
  }

}