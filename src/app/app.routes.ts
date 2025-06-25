import { Routes } from '@angular/router';
import { PublicShellComponent } from './layout/public-shell/public-shell.component';
import { PrivateShellComponent } from './layout/private-shell/private-shell.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ConfirmSmsComponent } from './pages/confirm-sms/confirm-sms.component';
import { CompanyComponent } from './pages/company/company.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BoardsComponent } from './pages/boards/boards.component';
import { BoardComponent } from './pages/board/board.component';
import { TaskPageComponent } from './pages/task-page/task-page.component';
import { DashboardSettingsComponent } from './pages/dashboard-settings/dashboard-settings.component';
import { PostLoginRedirectComponent } from './pages/past-login-redirect/past-login-redirect.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { FeedComponent } from './pages/feed/feed.component';
import { LicenseComponent } from './pages/license/license.component';
import { PlanComponent } from './pages/plan/plan.component';
import { SupportComponent } from './pages/support/support.component';
import { MyTasksComponent } from './pages/my-tasks/my-tasks.component';

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
