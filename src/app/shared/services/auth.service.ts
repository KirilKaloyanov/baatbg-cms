import { inject, Injectable } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  user,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map, Observable, of, switchMap } from 'rxjs';
import { DbService } from './db.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth = inject(Auth);
  private dbService: DbService = inject(DbService);
  private router: Router = inject(Router);

  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, new GoogleAuthProvider());
      if (result.user) {
        const uid = result.user.uid;
        this.isUserAdmin(uid).subscribe((isAdmin) => {
          if (!isAdmin) {
            this.router.navigate(['/forbidden']);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  getLoggedUser$: Observable<User | null> = user(this.auth);

  isUserAdmin$: Observable<boolean> = this.getLoggedUser$.pipe(
    switchMap((user: User | null) => {
      if (user) return this.isUserAdmin(user.uid)
      return of(false) as Observable<boolean>;
    })
  )

  isUserAdmin(uid: string): Observable<boolean> {
    return this.dbService.getDocument<string | null>('admins', uid)
              .pipe(
                  map((user: any) => !!user) 
              )
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/']);
  }
}
