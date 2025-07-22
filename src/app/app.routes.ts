import { Routes } from '@angular/router';

import { PublicShellComponent } from './layout/public-shell/public-shell.component';
import { PrivateShellComponent } from './layout/private-shell/private-shell.component';

import {
  LoginComponent,
  RegisterComponent,
  ConfirmSmsComponent,
  CompanyComponent,
  ProfileComponent,
  BoardsComponent,
  BoardComponent,
  TaskPageComponent,
  DashboardSettingsComponent,
  PostLoginRedirectComponent,
  PrivacyComponent,
  FeedComponent,
  LicenseComponent,
  SupportComponent,
  MyTasksComponent,
} from './features';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { guestGuard } from './core/guards/guest.guard';
import { pendingChangesGuard } from './core/guards/pending-changes.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicShellComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [guestGuard],
      },
      {
        path: 'confirm-sms',
        component: ConfirmSmsComponent,
        canActivate: [guestGuard],
      },
      { path: 'post-login-redirect', component: PostLoginRedirectComponent },
    ],
  },
  {
    path: '',
    component: PrivateShellComponent,
    //canActivateChild: [authGuard],
    children: [
      { path: 'company', component: CompanyComponent },
      {
        path: 'profile',
        component: ProfileComponent,
        canDeactivate: [pendingChangesGuard],
      },
      { path: 'boards', component: BoardsComponent },
      { path: 'boards/:id', component: BoardComponent },
      {
        path: 'boards/:boardId/tasks/:taskId',
        component: TaskPageComponent,
        canDeactivate: [pendingChangesGuard],
      },
      {
        path: 'boards/:id/dashboard-settings',
        component: DashboardSettingsComponent,
        //canActivate: [roleGuard],
        //data: { roles: ['admin', 'owner'] },
        canDeactivate: [pendingChangesGuard],
      },
      { path: 'privacy', component: PrivacyComponent },
      { path: 'feed', component: FeedComponent },
      { path: 'license', component: LicenseComponent },
      { path: 'support', component: SupportComponent },
      { path: 'my-tasks', component: MyTasksComponent },
      {
        path: 'tasks/:id',
        component: TaskPageComponent,
        canDeactivate: [pendingChangesGuard],
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
