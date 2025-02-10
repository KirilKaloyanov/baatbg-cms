import { Component } from "@angular/core";
import { DbService } from './../../../shared/services/db.service';
import { Observable } from "rxjs";

interface Member {
    id: string;
    name: string;
}

@Component({
    selector: 'app-member',
    template: `
        <h1>member</h1>
    `
})
export class MemberComponent {
    member$!: Observable<Member>;
    constructor(private dbService: DbService) {
        this.member$ = this.dbService.getOneDocument('members', 'dshka');
        this.member$.subscribe({
            next: val => console.log(val),
            error: err => console.log(err)
        })
    }
}