import { Component, inject } from "@angular/core";
import { AuthService } from "../shared/services/auth.service";
import { AsyncPipe, NgFor } from "@angular/common";
import { collection, collectionData, Firestore } from "@angular/fire/firestore";


interface Item {
    avatarId: string,
    content: string,
    heartCount: number
}
@Component({
    selector: 'app-dashboard',
    template: `<div>
    <h4>Dashboard</h4>
    <ul>
        @for(item of (items$ | async); track item) {
            <li>{{item.content}}</li>
        }
    </ul>
    </div>`,
    imports: [AsyncPipe]
})
export class DashboardComponent {
    
    firestore: Firestore = inject(Firestore);
    myColl: any = collection(this.firestore, 'tweets'); //BszSjkFm3sItACBeneX3
    items$ = collectionData<Item>(this.myColl);
    
    ngOnInit() {
        this.items$.subscribe((i) => console.log(i));
    }


}