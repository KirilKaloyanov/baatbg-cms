import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-modal.component.html',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class ConfirmModal {}
