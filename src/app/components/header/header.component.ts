import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  userAuthenticated: boolean = true

  constructor(private login: AuthService, private router: Router) { }

  ngOnInit() {
    this.update()
  }

  update() {
    this.userAuthenticated = this.login.isAuthenticated()
  }

  navLogout() {
    this.login.logout()
    this.router.navigateByUrl('/login')
    this.update()
  }
  
}
