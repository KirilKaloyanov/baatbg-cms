import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrl: 'home.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
  ],
})
export class HomeComponent {
  user!: string | null;
  isAuthorized: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getLoggedUser$.subscribe((user) => {
      this.user = user ? user.displayName : null;
    });
    this.authService.isUserAdmin$.subscribe((isAdmin) => {
      this.isAuthorized = isAdmin;
    });
  }

  login() {
    this.authService.loginWithGoogle();
  }

  logout() {
    this.isAuthorized = false;
    this.authService.logout();
  }
}
