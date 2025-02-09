import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class ToasterService {
    private toastMessageSubject = new BehaviorSubject< string | null>(null);

    toastMessage$ = this.toastMessageSubject.asObservable();


    showMessage(message: string | null, duration: number = 1500) {
        this.toastMessageSubject.next( message );

        setTimeout(() => {
            this.toastMessageSubject.next(null);
        }, duration) 
    }
}