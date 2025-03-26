import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, model, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'image-dialog',
  templateUrl: 'image-modal.component.html',
  styles: `
    mat-form-field {
        display: block;
        width: 100%;
    }
    mat-slider {
      width: 90%
    }
    .image-container {
        max-width: 450px;
        margin-bottom: 12px;
    }
    img {
        width: 100%;
    }
  `,
  imports: [
    CommonModule,
    FormsModule,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSliderModule,
  ],
})
export class ImageModal {
  @ViewChild('imageRef') imageElement!: ElementRef<HTMLImageElement>;
  dialogRef = inject(MatDialogRef<ImageModal>);
  data = inject(MAT_DIALOG_DATA);
  imageSize = model(900);
  folderPath = model('');
  altText = model('');

  currentStyle = {
    width: `${this.imageSize}px`,
  };

  onConfirm() {
    if (!this.altText()) return;

    return {
      size: this.imageSize(),
      path: this.folderPath(),
      alt: this.altText(),
    };
  }

  onImageLoad() {
    const el = this.imageElement.nativeElement;
    console.log(el.naturalHeight, el.naturalWidth);
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
