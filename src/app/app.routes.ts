import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForbiddenComponent } from './shared/components/forbidden.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'forbidden', component: ForbiddenComponent }
];
