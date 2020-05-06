import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostlistComponent implements OnInit{
  constructor(private postService: PostService, private authService: AuthService) { }
  loading: boolean = false;
  posts: Post[] = [];
  subscriptions : Subscription[] = [];
  totalPosts: number = 0;
  pageSize: number = 2;
  currentPage: number = 1;
  pageSizeOptions: number[] = [1,2,5,10];
  isAuthenticated: boolean = false;
  userId: string;

  ngOnInit() {
    this.postService.getPosts(this.pageSize,this.currentPage);
    this.userId = this.authService.getUserId();
    this.loading = true;
    this.postService.listenForPosts().subscribe((resp: {posts: Post[], postCount: number}) => {
      this.posts = [...resp.posts];
      this.totalPosts = resp.postCount;
      this.loading = false;
    });
    this.subscriptions.push(this.authService.getAuthStatus().subscribe(resp => {
      this.isAuthenticated = resp;
      this.userId = this.authService.getUserId();
    }));
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  onDelete(id:string) {
    this.loading = true;
    this.postService.deletePost(id).subscribe(resp => {
      this.loading = false;
      this.postService.getPosts(this.pageSize,this.currentPage);
    });
  }
  onPageChange(data: PageEvent) {
    this.currentPage = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.loading = true;
    this.postService.getPosts(this.pageSize,this.currentPage);
  }
}
