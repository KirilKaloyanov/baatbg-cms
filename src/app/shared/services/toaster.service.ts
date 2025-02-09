import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject } from "rxjs";


@Injectable({
    providedIn: "root"
})
export class ToasterService {
    private toastMessageSubject = new BehaviorSubject< {message: string, isError: boolean} | null>(null);

    toastMessage$ = this.toastMessageSubject.asObservable();


    showSuccess(message: string = 'Operation successful', redirectFn?: () => void) {
        const notification = {message, isError: false}
        this.toastMessageSubject.next( notification );

        setTimeout(() => {
            this.toastMessageSubject.next(null);
            if (typeof redirectFn == 'function') redirectFn();
        }, 1500) 
    }

    showError(message: string = 'Operation failed', redirectFn?: () => void) {
        const notification = {message, isError: true}
        this.toastMessageSubject.next( notification );

        setTimeout(() => {
            this.toastMessageSubject.next(null);
            if (typeof redirectFn == 'function') redirectFn();
        }, 2000) 
    }
}