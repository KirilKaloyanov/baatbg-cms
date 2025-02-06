import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  Auth,
  getAuth,
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
  // constructor(private afAuth: AngularFireAuth, private userService: UserService, private router: Router) {}

  user: {name: string, role?: string} | null = null;

  private auth: Auth = inject(Auth);
  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);

  async loginWithGoogle(): Promise<void> {
    try {
      const result = await signInWithPopup(this.auth, new GoogleAuthProvider());
      if (result.user) {
        const uid = result.user.uid;
        this.userService.getUserRole(uid).subscribe((role) => {
          console.log(uid, role);
          if (role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else {
            // alert('Forbidden');
            // this.logout();
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
