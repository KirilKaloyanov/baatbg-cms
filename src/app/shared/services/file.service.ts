import { Injectable } from '@angular/core';
import { from, map, Observable, of, switchMap, throwError } from 'rxjs';
import { ImageData } from 'quill-image-drop-and-paste';
import { ImageOptions } from './image.service';

@Injectable({
  providedIn: 'root',
})
export class FileService {

  getDataUrl(file: File): Observable<string> {
    return new Observable((observer) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const dataUrl = e.target?.result;

        if (typeof dataUrl == 'string') {
          observer.next(dataUrl);
        } else {
          throwError(() => new Error('Transforming file to dataURL failed.'));
        }
        observer.complete();
      };
      reader.readAsDataURL(file);
    });
  }

  transformAndWrapImageForUpload(
    { type: fileType, name: fileName }: FileOptions,
    imageOptions: ImageOptions,
    dataUrl: string
  ): Observable<PreparedImage> {
    const imageData = new ImageData(dataUrl, fileType, fileName);

    return from(
      imageData.minify({
        maxHeight: imageOptions.side,
        maxWidth: imageOptions.side,
        quality: 0.7,
      })
    ).pipe(
      map((miniImage) => ({ miniImage, imageOptions })),
      switchMap(({ miniImage, imageOptions }) => {
        let fileToUpload = null;

        if (miniImage instanceof ImageData) {
          fileToUpload = miniImage.toFile();
        }

        if (!fileToUpload) {
          return throwError(() => new Error('File creation failed'));
        }

        return of<PreparedImage>({
          fileToUpload,
          filePath: imageOptions.path,
          altText: imageOptions.alt,
        });
      })
    );
  }
}

interface FileOptions {
  name: string;
  type: string;
}

interface PreparedImage {
    fileToUpload: File;
    filePath: string,
    altText: string
}