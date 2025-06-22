import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ConfirmSmsComponent } from './pages/confirm-sms/confirm-sms.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirm-sms', component: ConfirmSmsComponent },
  { path: '**', redirectTo: 'login' }
];
