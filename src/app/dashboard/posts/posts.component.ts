import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Post } from './post.model';
import { PostService } from './post.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'dashboard-layout',
  templateUrl: 'posts.component.html',
  styleUrl: 'posts.component.scss',
  imports: [CommonModule, RouterModule],
})
export class PostsComponent {
  groupedPosts$!: Observable<Post[][]>;

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit() {
    this.groupedPosts$ = this.postService.getPostsGroupByMenuId(); //.pipe(tap((value) => console.log(value)))
  }
  addNewItem() {
    this.router.navigate(['/dashboard/posts/create']);
  }

  // editItem(itemId: string) {
  //   this.router.navigate(['/dashboard/posts/edit', itemId]);
  // }
}
