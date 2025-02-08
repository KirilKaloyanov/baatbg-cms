import { inject, Injectable } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  user,
} from '@angular/fire/auth';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth = inject(Auth);
  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);

  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, new GoogleAuthProvider());
      if (result.user) {
        const uid = result.user.uid;
        this.userService.getRole(uid).subscribe((role) => {
          if (role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/forbidden']);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  getLoggedUser$: Observable<User | null> = user(this.auth);

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/']);
  }
}
