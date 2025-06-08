import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { map, Observable, tap } from 'rxjs';

import { Post } from './post.model';
import { PostService } from './post.service';

@Component({
  selector: 'app-posts',
  templateUrl: 'posts.component.html',
  styleUrl: 'posts.component.scss',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
})
export class PostsComponent {
  groupedPosts$!: Observable<Post[][]>;

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit() {
    this.groupedPosts$ = this.postService.getPostsGroupByMenuId().pipe(
      map(items => {
        items.forEach(subitem => subitem.sort((a, b) => a.position - b.position))
        return items;
      })
    ); 
  }
  addNewItem() {
    this.router.navigate(['/dashboard/posts/create']);
  }
}
