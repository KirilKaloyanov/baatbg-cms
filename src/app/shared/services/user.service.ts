import { EnvironmentInjector, inject, Injectable } from "@angular/core";
import { Firestore, doc, docData } from "@angular/fire/firestore";
import { Observable, map } from "rxjs";
import { DbService } from "./db.service";

@Injectable({ providedIn: "root"})
export class UserService {
    constructor(private dbService: DbService) {}

    getRole(uid: string): Observable<string | null> {
        return this.dbService.getDocument('admins', uid)
            .pipe(
                map((user: any) => (user ? user.role : null))
            )
    }
}