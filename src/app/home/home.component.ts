import { Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  Auth,
} from '@angular/fire/auth';
import { AuthService } from '../shared/services/auth.service';
import { Observable, of, startWith, switchMap } from 'rxjs';
import { UserService } from './../shared/services/user.service';
import { RouterLink, RouterModule } from '@angular/router';

interface Item {
  avatarId: string;
  content: string;
  heartCount: number;
}

@Component({
  selector: 'app-home',
  template: `
    <div>
      <ul>
        <li>{{ user$ | async }}</li>
      </ul>
      <button *ngIf="!isUserAuthorized" (click)="login()">Sign in with Google</button>
      <button *ngIf="isUserAuthorized" (click)="logout()">Logout</button>
      <button *ngIf="isUserAuthorized" [routerLink]="'/dashboard'">Dashboard</button>
    </div>
  `,
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterModule],
})
export class HomeComponent {
  user$!: Observable<any>;
  isUserAuthorized: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user$ = this.authService.getLoggedUser$.pipe(
      switchMap((user) => {
        if (user) {
          return this.userService.getRole(user.uid).pipe(
            switchMap((role) => {
              if (role === 'admin') {
                this.isUserAuthorized = true;
                return of(user.displayName);
              }
              this.isUserAuthorized = false;
              return of('Unauthorized');
            })
          );
        }
        return of('You are not logged in!');
      })
    );
  }

  login() {
    this.authService.loginWithGoogle();
  }

  logout() {
    this.isUserAuthorized = false;
    this.authService.logout();
  }
}

