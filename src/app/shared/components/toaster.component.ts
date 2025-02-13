import { Component } from '@angular/core';
import { ToasterService } from '../services/toaster.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toaster',
  template: `
    <div *ngIf="toastMessage$ | async as notification" class="toast" [class]="!notification.isError ? 'success' : 'failure'">
      {{ notification.message }}
    </div>
  `,
  styles: [`
    .toast {
      font-size: 2rem;
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      padding: 12px 20px;
      border-radius: 5px;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      opacity: 1;
      transition: opacity 0.3s ease-in-out;
    }
    .failure {
      background: rgba(85, 43, 43, 0.68);
    }

    .success {
      background: rgba(43, 85, 63, 0.65);
    }
  `],
  imports: [CommonModule]
})

export class ToasterComponent {
    toastMessage$!: Observable<{message: string, isError: boolean} | null>;
    constructor(private toasterService: ToasterService) {
        this.toastMessage$ = toasterService.toastMessage$;
    }
    
}
