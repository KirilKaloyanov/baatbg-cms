import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { UploadTaskSnapshot } from 'firebase/storage';
import { ToasterService } from './toaster.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(
    private dbService: DbService,
    private toaster: ToasterService,
    private loader: LoaderService
  ) {}

  uploadFile(file: File, filepath: string) {
    return this.dbService.uploadFile(file, filepath).pipe(
      tap((value) => {
        if (typeof value == 'object') {
          const snapshot = value as UploadTaskSnapshot;
          const progress = Math.floor(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.loader.showProgress(progress);
        }
        if (value == 'uploaded') {
          this.toaster.showSuccess('Successfully uploaded document');
          this.loader.hideProgress();
        }
      }),
      catchError((error) => {
        this.toaster.showError('Error uploading document ' + error.message);
        this.loader.hideProgress();
        return throwError(() => error);
      })
    );
  }
}
