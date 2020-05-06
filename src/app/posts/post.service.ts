import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const POSTS_URL = environment.domain + 'posts';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient, private router: Router) {

  }
  private localPosts: Post[] = [];
  private posts: Subject<{ posts: Post[], postCount: number}> = new Subject();
  private fetchPosts: Observable<{ posts: Post[], postCount: number}> = this.posts.asObservable();

  getPosts(pageSize: number, currentPage: number) {
    const queryParams = `?pageSize=${pageSize}&currentPage=${currentPage}`;
    this.http.get<{message: string, posts: any, postCount: number}>(POSTS_URL + queryParams)
    .pipe(map(postData => {
      return { posts: postData.posts.map(post => {
        return { title: post.title, content: post.content, id: post._id, imagePath: post.imagePath, creator: post.creator }
      }), postCount: postData.postCount }
    })).subscribe((resp: {posts: Post[], postCount: number}) => {
      this.localPosts = resp.posts;
      this.posts.next({ posts: [...this.localPosts], postCount: resp.postCount });

    });
  }
  listenForPosts() {
    return this.fetchPosts;
  }
  addPost(postTitle: string, postContent: string, image: File) {
    const postData = new FormData();
    postData.append("title",postTitle);
    postData.append("content",postContent);
    postData.append("image", image, postTitle);
    this.http.post<{message:string, post: Post}>(POSTS_URL, postData).subscribe(resp => {
      this.router.navigate(["/"]);
    })
  }
  deletePost(id: string) {
    return this.http.delete(POSTS_URL + "/" + id);
  }
  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>(POSTS_URL + "/" + id);
  }
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if(typeof image === "object") {
      postData = new FormData();
      postData.append("title",title);
      postData.append("content",content);
      postData.append("image", image, title);
    } else {
      postData = { id: id, title: title, content: content, imagePath: image, creator: null };
    }
    this.http.put(POSTS_URL + "/" + id, postData).subscribe(resp => {
      // const updatedPosts = [...this.localPosts];
      // const updatedIndex = updatedPosts.findIndex(post => id === id);
      // const post: Post = { id: id, title: title, content: content, imagePath: "" };
      // updatedPosts[updatedIndex] = post;
      // this.localPosts = updatedPosts;
      // this.posts.next(this.localPosts);
      this.router.navigate(["/"]);
    });
  }
}
