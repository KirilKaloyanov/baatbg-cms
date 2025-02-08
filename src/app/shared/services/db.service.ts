import { EnvironmentInjector, inject, Injectable } from "@angular/core";
import { Firestore, collection, collectionData, doc, docData } from "@angular/fire/firestore";
import { setDoc } from "firebase/firestore";
import { catchError, finalize, from, map, Observable, tap } from "rxjs";
import { LoaderService } from "./loader.service";


@Injectable({providedIn: 'root'})
export class DbService {
    constructor (
        private firestore: Firestore, 
        private loaderService: LoaderService,
        private envInjector: EnvironmentInjector
    ) {}


    getCollection(collectionName: string) {
        return this.runInFirebaseContext(() => {
            const colRef = collection(this.firestore, collectionName);
            return collectionData(colRef, {idField: 'id'});
        })
    }


    getDocument(collectionName: string, docName: string) {
        return this.runInFirebaseContext(() => {
            const docRef = doc(this.firestore, `${collectionName}/${docName}`)
            return docData(docRef, { idField: 'id'});
        })
    }

    saveDocument(collectionName: string, payload: { id: string }) {
        return this.runInFirebaseContext(
            () =>  from(setDoc(
                doc(this.firestore, `${collectionName}/${payload.id}`),
                payload
            ))
        )
    }

    runInFirebaseContext<T>(fn: () => Observable<T>): Observable<T> {
        return new Observable(observer => {
            this.envInjector.runInContext(() => {
                //start loader
                this.loaderService.show();
                // console.log('start', fn)
                fn()
                .pipe(
                    tap((value)=> {
                        // console.log('end', value)
                        this.loaderService.hide()
                    })
                )
                .subscribe({
                    next: value => observer.next(value),
                    error: err => observer.error(err),
                    complete: () => observer.complete()
                });
            });
        });
    }
}