import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({
    providedIn: "root"
})
export class ToasterService {
    private toastMessageSubject = new BehaviorSubject< {message: string, isError: boolean} | null>(null);

    toastMessage$ = this.toastMessageSubject.asObservable();

    timeOut: any = null;


    showSuccess(message: string = 'Operation successful', redirectFn?: () => void) {
        if (this.timeOut) {
            clearTimeout(this.timeOut)
        }
        const notification = {message, isError: false}
        this.toastMessageSubject.next( notification );

        this.timeOut = setTimeout(() => {
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
        }, 3500) 
    }
}