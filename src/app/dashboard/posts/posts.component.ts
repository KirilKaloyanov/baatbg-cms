import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { Observable, tap } from 'rxjs';

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
    this.groupedPosts$ = this.postService.getPostsGroupByMenuId(); //.pipe(tap((value) => console.log(value)))
  }
  addNewItem() {
    this.router.navigate(['/dashboard/posts/create']);
  }
}
