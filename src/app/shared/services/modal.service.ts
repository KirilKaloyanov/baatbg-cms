import { Injectable } from "@angular/core";
import { ImageOptions } from "./image.service";
import { Observable, of, switchMap, throwError } from "rxjs";
import { ImageModal } from "@shared/components/modals/image-modal.component";
import { MatDialog } from "@angular/material/dialog";

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    constructor (private dialog: MatDialog) {}

    promptImageOptions(
        dataUrl: string,
        onlySizeOption = true
      ): Observable<ImageOptions> {
        return this.dialog
          .open(ImageModal, {
            data: { dataUrl, onlySizeOption },
            width: '100%',
            height: onlySizeOption ? '90%' : '100dvh',
          })
          .afterClosed()
          .pipe(
            switchMap((imageOptions: ImageOptions) => {
              if (!imageOptions) {
    
                return throwError(() => new Error('No input provided'));
              }
    
              return of(imageOptions);
            })
          );
      }
}