import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { stringify } from '@angular/compiler/src/util';
import { Router } from '@angular/router';

const nodeHostAddress = 'http://localhost:3000';

@Injectable({providedIn: 'root'})
export class PostService {

  private posts: Post [] = [];
  private postUpdated = new Subject<Post[]>();

  constructor( private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http.get<{message: string, posts: any}>(nodeHostAddress + '/api/posts')
    .pipe(map((PostData) => {

      return PostData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        };
      });
    })).
    subscribe((transformedPosts) => {
      this.posts = transformedPosts;
      this.postUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string}>(nodeHostAddress + '/api/posts/' + id);
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title, content};
    this.http.post<{message: string, id: string}>(nodeHostAddress + '/api/posts', post).subscribe((responseData) => {
      const postId = responseData.id;
      post.id = postId;
      console.log(responseData.message);
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {id, title, content};
    this.http.put(nodeHostAddress + '/api/posts/' + id, post).subscribe(res => {

      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts  = updatedPosts;
      this.postUpdated.next([...this.posts]);
      this.router.navigate(['/']);
      console.log(res);
    });
  }

  deletePost(id: string) {
    this.http.delete(nodeHostAddress + '/api/posts/' + id).subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== id);
      this.posts = updatedPosts;
      this.postUpdated.next([...updatedPosts]);
    });
  }
}



// VubKLBxHOiBlPzGi
