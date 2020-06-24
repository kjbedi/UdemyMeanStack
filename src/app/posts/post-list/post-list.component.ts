import { Component, OnInit, OnDestroy} from '@angular/core';

import { Post } from '../post.model';
import { PostService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({

  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})


export class PostListComponent implements OnInit, OnDestroy {

  constructor(public postService: PostService) {

  }

  private postsSub: Subscription;
  isLoading = false;

  posts: Post[] = [];
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  onDelete(id: string) {
    this.postService.deletePost(id);
    console.log(id);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsSub = this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });
    this.postService.getPosts();
  }

}
