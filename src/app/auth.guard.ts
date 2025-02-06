import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth } from '@angular/fire/auth';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './shared/services/user.service';
import { Observable, map, of, switchMap, take } from 'rxjs';
import { AuthService } from './shared/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private authService: AuthService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.authService.getLoggedUser$.pipe(
      take(1),
      switchMap((user) => {
        console.log(user);
        if (user) {
          return this.userService.getUserRole(user.uid);
        } else {
          this.router.navigate(['/']);
          return of(false);
        }
      }),
      map((role: any) => {
        console.log(role);
        if (role === 'admin') {
          return true;
        } else {
          this.router.navigate(['/forbidden']);
          return false;
        }
      })
    ) as Observable<boolean>;
  }
}
