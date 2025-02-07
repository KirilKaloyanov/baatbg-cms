import { EnvironmentInjector, inject, Injectable } from "@angular/core";
import { Firestore, collection, collectionData, doc, docData } from "@angular/fire/firestore";
import { Observable } from "rxjs";


@Injectable({providedIn: 'root'})
export class DbService {
    constructor (private firestore: Firestore, private envInjector: EnvironmentInjector) {}


    getCollection(collectionName: string) {
        return this.runInFirebaseContext(() => {
            const colRef = collection(this.firestore, collectionName);
            return collectionData(colRef, {idField: 'id'});
        })
    }


    getDocument(collectionName: string, docName: string) {
        return this.runInFirebaseContext(() => {
            const docRef = doc(this.firestore, `${collectionName}/${docName}`)
            return docData(docRef);
        })
    }



    // getUserRole(uid: string): Observable<string | null> {
    //     return this.injector.runInContext(() => {
    //         const userDocRef = doc(this.firestore, `admins/${uid}`)
    //         return docData(userDocRef).pipe(
    //                 map((user: any) => (user ? user.role : null))
    //             )
    //     })
    // }

    runInFirebaseContext<T>(fn: () => Observable<T>): Observable<T> {
        return new Observable(observer => {
            this.envInjector.runInContext(() => {
            fn().subscribe({
                next: value => observer.next(value),
                error: err => observer.error(err),
                complete: () => observer.complete(),
            });
            });
        });
    }
}