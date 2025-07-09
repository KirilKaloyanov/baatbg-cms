import { inject, Injectable, input } from '@angular/core';
import { StorageService } from './storage.service';
import { DbService } from './db.service';
import {
  filter,
  map,
  Observable,
  switchMap,
  take,
} from 'rxjs';
import { FileService } from './file.service';
import { ModalService } from './modal.service';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(
    private storage: StorageService,
    private dbService: DbService,
    private fileService: FileService,
    private modalService: ModalService,
  ) {}


  getPreparedImageFile(
    file: File,
    folder: string = '',
    onlySizeOption = true
  ) {
    const dataUrl$ = this.fileService.getDataUrl(file);
    const imageOptions$ = dataUrl$.pipe(
      switchMap((dataUrl) =>
        this.modalService.promptImageOptions(dataUrl, onlySizeOption).pipe(
          map((imageOptions) => {
            return {
              imageOptions: {
                ...imageOptions,
                path: folder + imageOptions.path
              },
              dataUrl
            }
          })
        )
      )
    );

    return imageOptions$.pipe(
      switchMap(({ imageOptions, dataUrl }) =>
        this.fileService.transformAndWrapImageForUpload(
          { type: file.type, name: file.name },
          imageOptions,
          dataUrl
        )
      )
    );
  }

  uploadEmbeddedImage(file: File, folder: string): Observable<ImageUrl> {
    const imageForEmbedding$ = this.getPreparedImageFile(
      file,
      folder,
      false
    );

    return imageForEmbedding$.pipe(
      switchMap(({ fileToUpload, filePath, altText }) =>
        this.uploadImage(fileToUpload, filePath, altText)
      )
    );
  }  
  
  uploadImage(
    fileToUpload: File,
    filePath: string,
    altText: string = ''
  ): Observable<ImageUrl> {
    return this.storage.uploadFile(fileToUpload, filePath).pipe(
      filter((value) => value === 'uploaded' || value === null),
      take(1),
      switchMap(() => {
        return this.dbService
        .getFileUrl(filePath + fileToUpload.name)
        .pipe(map((url) => ({ url, alt: altText })));
      })
    );
  }
}


export interface ImageOptions {
  side: number;
  path: string;
  alt: string;
}


export interface ImageUrl {
  url: string,
  alt: string
}
