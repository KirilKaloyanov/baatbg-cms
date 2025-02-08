import { CommonModule } from "@angular/common";
import { Component} from "@angular/core";
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { DbService } from '../../shared/services/db.service';
import { Observable } from 'rxjs';

// interface Item {
//     avatarId: string;
//     content: string;
//     heartCount: number;
//   }

@Component({
    selector: "dashboard-layout",
    templateUrl: "posts.component.html",
    styleUrl: "posts.component.scss",
    imports: [CommonModule]
})
export class PostsComponent {
// firestore: Firestore = inject(Firestore);
  // myColl: any = collection(this.firestore, 'tweets'); //BszSjkFm3sItACBeneX3
  // items$ = collectionData<Item>(this.myColl);

  posts$!: Observable<any>;

  constructor(private dbService: DbService) {}

  ngOnInit() {
    // this.items$.subscribe((i) => console.log(i));

    this.posts$ = this.dbService.getCollection('posts');

  }
}