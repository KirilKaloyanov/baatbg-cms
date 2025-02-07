import { Component, inject } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { AsyncPipe, NgFor } from '@angular/common';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { DbService } from '../shared/services/db.service';
import { Observable } from 'rxjs';

interface Item {
  avatarId: string;
  content: string;
  heartCount: number;
}
@Component({
  selector: 'app-dashboard',
  template: `<div>
    <h4>Dashboard</h4>
    <ul>
      @for(item of (menu$ | async); track $index) {
      <li>{{ item.name }}</li>
      }
    </ul>
  </div>`,
  imports: [AsyncPipe],
})
export class DashboardComponent {
  // firestore: Firestore = inject(Firestore);
  // myColl: any = collection(this.firestore, 'tweets'); //BszSjkFm3sItACBeneX3
  // items$ = collectionData<Item>(this.myColl);

  menu$!: Observable<any>;

  constructor(private dbService: DbService) {}

  ngOnInit() {
    // this.items$.subscribe((i) => console.log(i));

    this.menu$ = this.dbService.getCollection('menu');
    this.menu$.subscribe((i) => console.log(i));
    this.dbService.getDocument("posts", "boQ2ihM0QdlCHrMZasFr").subscribe((doc) => {
        console.log(doc)
    })
  }
}
