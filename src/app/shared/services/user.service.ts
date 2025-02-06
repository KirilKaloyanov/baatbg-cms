import { EnvironmentInjector, inject, Injectable } from "@angular/core";
import { Firestore, doc, docData } from "@angular/fire/firestore";
import { Observable, map } from "rxjs";

@Injectable({ providedIn: "root"})
export class UserService {
    // private firestore: Firestore = inject(Firestore);
    // private injector: EnvironmentInjector = inject(EnvironmentInjector);

    constructor(private firestore: Firestore, private injector: EnvironmentInjector) {}

    getUserRole(uid: string): Observable<string | null> {
        return this.injector.runInContext(() => {
            const userDocRef = doc(this.firestore, `admins/${uid}`)
            return docData(userDocRef).pipe(
                    map((user: any) => (user ? user.role : null))
                )
        })

    }
}