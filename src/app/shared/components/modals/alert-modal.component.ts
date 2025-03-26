import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'alert-modal',
  templateUrl: 'alert-modal.component.html',
  imports: [CommonModule, MatDialogModule, MatButton],
})
export class AlertModal {
  data = inject(MAT_DIALOG_DATA);
}
