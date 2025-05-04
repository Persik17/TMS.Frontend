import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './modules/auth/auth.component';
import { CompanyComponent } from './modules/company/company.component';
import { DepartmentsComponent } from './modules/departments/departments.component';
import { BoardsComponent } from './modules/boards/boards.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { UsersComponent } from './modules/users/users.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'company', component: CompanyComponent },
  { path: 'departments', component: DepartmentsComponent },
  { path: 'boards', component: BoardsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'users', component: UsersComponent },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
