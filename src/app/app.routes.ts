import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ForbiddenComponent } from './shared/components/forbidden.component';
import { NotFoundComponent } from './shared/components/not-found.component';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import("./home/home.component")
      .then(m => m.HomeComponent) 
  },
  { 
    path: 'dashboard', 
    loadChildren: () => import("./dashboard/dashboard.routes")
      .then(m => m.routes), canActivate: [AuthGuard] 
  },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '**', component: NotFoundComponent}
];
