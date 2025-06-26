import { Routes } from '@angular/router';
import { PublicShellComponent } from './layout/public-shell/public-shell.component';
import { PrivateShellComponent } from './layout/private-shell/private-shell.component';
import { LoginComponent } from './features';
import { RegisterComponent } from './features';
import { ConfirmSmsComponent } from './features';
import { CompanyComponent } from './features';
import { ProfileComponent } from './features';
import { BoardsComponent } from './features';
import { BoardComponent } from './features';
import { TaskPageComponent } from './features';
import { DashboardSettingsComponent } from './features';
import { PostLoginRedirectComponent } from './features';
import { PrivacyComponent } from './features';
import { FeedComponent } from './features';
import { LicenseComponent } from './features';
import { PlanComponent } from './features';
import { SupportComponent } from './features';
import { MyTasksComponent } from './features';

export const routes: Routes = [
  {
    path: '',
    component: PublicShellComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'confirm-sms', component: ConfirmSmsComponent },
      { path: 'post-login-redirect', component: PostLoginRedirectComponent },
    ],
  },
  {
    path: '',
    component: PrivateShellComponent,
    children: [
      { path: 'company', component: CompanyComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'boards', component: BoardsComponent },
      { path: 'boards/:id', component: BoardComponent },
      { path: 'boards/:boardId/tasks/:taskId', component: TaskPageComponent },
      {
        path: 'boards/:id/dashboard-settings',
        component: DashboardSettingsComponent,
      },
      { path: 'privacy', component: PrivacyComponent },
      { path: 'feed', component: FeedComponent },
      { path: 'license', component: LicenseComponent },
      { path: 'plan', component: PlanComponent },
      { path: 'support', component: SupportComponent },
      { path: 'my-tasks', component: MyTasksComponent },
      { path: 'tasks/:id', component: TaskPageComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
