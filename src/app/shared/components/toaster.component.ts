import { Component } from '@angular/core';
import { ToasterService } from '../services/toaster.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toaster',
  template: `
    <div *ngIf="toastMessage$ | async as message" class="toast">
      {{ message }}
    </div>
  `,
  styles: [`
    .toast {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(85, 43, 43, 0.46);
      color: white;
      padding: 12px 20px;
      border-radius: 5px;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      opacity: 1;
      transition: opacity 0.3s ease-in-out;
    }
  `],
  imports: [CommonModule]
})

export class ToasterComponent {
    toastMessage$!: Observable<any>;
    constructor(private toasterService: ToasterService) {
        this.toastMessage$ = toasterService.toastMessage$;
    }
    
}
