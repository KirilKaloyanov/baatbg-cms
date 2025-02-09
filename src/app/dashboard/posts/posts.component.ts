import { CommonModule } from "@angular/common";
import { Component} from "@angular/core";
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { DbService } from '../../shared/services/db.service';
import { Observable } from 'rxjs';
import { Post } from "./post.model";


@Component({
    selector: "dashboard-layout",
    templateUrl: "posts.component.html",
    styleUrl: "posts.component.scss",
    imports: [CommonModule]
})
export class PostsComponent {

  posts$!: Observable<Post[]>;

  constructor(private dbService: DbService) {}

  ngOnInit() {
    this.posts$ = this.dbService.getPostCollection();

    
  }
}