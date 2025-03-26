import { CommonModule } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'input-dialog',
  templateUrl: 'input-modal.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class InputModal {
  data = inject(MAT_DIALOG_DATA);
  folderPath = model('');
  private dialogRef = inject(MatDialogRef<InputModal>);

  onNoClick() {
    this.dialogRef.close();
  }
}
