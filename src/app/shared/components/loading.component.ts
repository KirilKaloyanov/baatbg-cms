import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loader-overlay" *ngIf="loaderService.loading$ | async">
      <mat-spinner></mat-spinner>
    </div>

    <div class="loader-overlay" *ngIf="loaderService.loadingProgress$ | async">
      <mat-progress-spinner
        mode="determinate"
        [value]="loaderService.progressValue$ | async"
      ></mat-progress-spinner>
    </div>
  `,
  styleUrl: 'loading.component.scss',
  imports: [CommonModule, MatProgressSpinner],
})
export class LoadingComponent {
  constructor(public loaderService: LoaderService) {}
}
