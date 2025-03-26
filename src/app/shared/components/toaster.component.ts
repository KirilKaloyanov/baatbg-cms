import { Component, inject } from '@angular/core';
import { ToasterService } from '../services/toaster.service';
import { CommonModule } from '@angular/common';

import { Observable, tap } from 'rxjs';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toaster',
  template: '',
  imports: [CommonModule],
})
export class ToasterComponent {
  toastMessage$!: Observable<{ message: string; isError: boolean } | null>;

  _snackbar = inject(MatSnackBar);
  constructor(private toasterService: ToasterService) {
    this.toastMessage$ = toasterService.toastMessage$;

    this.toastMessage$
      .pipe(
        tap((value) => {
          const matSnackConf: MatSnackBarConfig = {
            panelClass: [value?.isError ? 'failure' : 'success'],
          };
          if (value) this._snackbar.open(value.message, '', matSnackConf);
          else this._snackbar.dismiss();
        })
      )
      .subscribe();
  }
}
