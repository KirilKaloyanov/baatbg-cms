import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatButtonModule, MatButton } from '@angular/material/button';

@Component({
  selector: 'dashboard-layout',
  templateUrl: 'dashboard-layout.component.html',
  styleUrl: 'dashboard-layout.component.scss',
  imports: [RouterModule, RouterOutlet, MatButtonModule],
})
export class DashboardLayoutComponent {}
