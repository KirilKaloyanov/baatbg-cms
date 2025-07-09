import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, model, ViewChild } from '@angular/core';
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
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 12px;
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

  imageSize = model(600);
  altText = model('');

  folderPath = model('');
  finalPath = computed(() => {
    return this.folderPath() === '' ? this.folderPath() : this.folderPath() + "/"
  })

  isAltTextMissing = computed(() => {
    return this.altText() == '' && !this.data.onlySizeOption
  })

  imageStyle = computed(() => ({
    'width': `${this.imageSize()}px`
  }))

  onConfirm() {
    if (this.isAltTextMissing() ) {
      return null;
    };

    return {
      size: this.imageSize(),
      path: this.finalPath(),
      alt: this.altText(),
    };
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
