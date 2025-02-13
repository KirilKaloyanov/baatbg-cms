import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';
import { RouterModule } from '@angular/router';

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
        <li *ngIf="user">
          {{user}}<span *ngIf="isAuthorized">, Welcome!</span><span *ngIf="!isAuthorized">, you are not authorized! </span>
        </li>
        <li *ngIf="!user">You are not logged in.</li>
      </ul>
      <button *ngIf="!user" (click)="login()">Sign in with Google</button>
      <button *ngIf="user" (click)="logout()">Logout</button>
      <button *ngIf="isAuthorized" [routerLink]="'/dashboard'">Dashboard</button>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HomeComponent {
  user!: string | null;
  isAuthorized: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getLoggedUser$.subscribe((user) => {
      this.user = user ? user.displayName : null;
    })
    this.authService.isUserAdmin$.subscribe(isAdmin => {
      this.isAuthorized = isAdmin;
    })
  }

  login() {
    this.authService.loginWithGoogle();
  }

  logout() {
    this.isAuthorized = false;
    this.authService.logout();
  }
}

