import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';
import { PostService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{

  private mode = 'create';
  private postId: string;
  isLoading = false;
  post: Post;
  ngOnInit(): void {

   this.route.paramMap.subscribe((paramMap: ParamMap) => {
    if (paramMap.has('postId')){
      this.mode = 'edit';
      this.postId = paramMap.get('postId');
      this.isLoading = true;
      this.postService.getPost(this.postId).subscribe(postData => {
        this.isLoading = false;
        this.post = {id: postData._id, title: postData.title, content: postData.content};
      });
    } else {
      this.mode = 'create';
    }
   });
  }

  constructor(public postService: PostService, public route: ActivatedRoute) {

  }

  onSavePost(form: NgForm){
    this.isLoading = true;
    if (form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postService.addPost(form.value.title, form.value.content);
    } else {
      this.postService.updatePost(this.postId, form.value.title, form.value.content);
    }
    form.resetForm();
  }
}
