import { Injectable } from "@angular/core";
import { DbService } from "./db.service";
import { UploadTaskSnapshot } from "firebase/storage";
import { ToasterService } from "./toaster.service";
import { catchError, Observable, tap, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(private dbService: DbService, private toaster: ToasterService) {}
    
    uploadFile(file: File, filepath: string) {
        return this.dbService
            .uploadFile(file, filepath).pipe(
                tap((value) => {
                    if (typeof value == 'object') {
                        const snapshot = value as UploadTaskSnapshot;
                        const progress = Math.floor(snapshot.bytesTransferred / snapshot.totalBytes * 100)
                        this.toaster.showSuccess(`Uploading ... ${progress} %`);
                    }
                    if (value == 'uploaded') {
                        this.toaster.showSuccess('Successfully uploaded document');
                    }
                }),
                catchError((error) => {
                    this.toaster.showError("Error uploading document", error.message);
                    return throwError(()=> error)
                })
            )
            // .subscribe({
            //     next: (res) => {
            //         if (typeof res == 'object'){
            //         const snapshot = res as UploadTaskSnapshot;
            //         const progress = Math.floor(snapshot.bytesTransferred / snapshot.totalBytes * 100)
            //         this.toaster.showSuccess(`Uploading ... ${progress} %`);
            //         }
            //     },
            //     error: (error) => {
            //         this.toaster.showError(error.message);
            //     },
            //     complete: () => {
            //         this.toaster.showSuccess('Successfully uploaded document');
            //     }
            // })
    }



}