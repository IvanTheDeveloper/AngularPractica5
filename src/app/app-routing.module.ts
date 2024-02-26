import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OrlasComponent } from './components/orlas/orlas.component';
import { PersonasComponent } from './components/personas/personas.component';
import { unauthenticatedUsersGuard } from './guards/unauthenticated-users.guard';
import { authenticatedUsersGuard } from './guards/authenticated-users.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [unauthenticatedUsersGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [unauthenticatedUsersGuard]},
  {path: 'orlas', component: OrlasComponent, canActivate: [authenticatedUsersGuard]},
  {path: 'personas', component: PersonasComponent, canActivate: [authenticatedUsersGuard]},
  {path: '', redirectTo: '/main', pathMatch: 'full'}, //landing page
  {path: 'main', redirectTo: '/orlas', pathMatch: 'full'}, //main page
  {path: '**', redirectTo: '/main'} //not found
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
