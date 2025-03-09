import { Injectable } from "@angular/core";
import { DbService } from "./db.service";
import { UploadTaskSnapshot } from "firebase/storage";
import { ToasterService } from "./toaster.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(private dbService: DbService, private toaster: ToasterService) {}
    
    uploadFile(file: File) {
        this.dbService
            .uploadFile(file)
            .subscribe({
                next: (res) => {
                    if (typeof res == 'object'){
                    const snapshot = res as UploadTaskSnapshot;
                    const progress = Math.floor(snapshot.bytesTransferred / snapshot.totalBytes * 100)
                    this.toaster.showSuccess(`Uploading ... ${progress} %`);
                    }
                },
                error: (error) => {
                    this.toaster.showError(error.message);
                },
                complete: () => {
                    this.toaster.showSuccess('Successfully uploaded document');
                }
            })
    }



}