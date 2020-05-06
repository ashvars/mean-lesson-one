import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatepostComponent implements OnInit, OnDestroy {

  private mode: boolean = false;
  private postId: string;
  post: Post;
  loading: boolean = false;
  form: FormGroup;
  imgPreview: string;
  sub: Subscription;

  constructor(private postService: PostService, private route: ActivatedRoute, private authService: AuthService) {}
  ngOnInit() {
    this.sub = this.authService.getAuthStatus().subscribe(resp => { this.loading = false; });
    this.form = new FormGroup({
      "title": new FormControl(null, { validators: [Validators.required, Validators.minLength(3)], updateOn: "change" }),
      "content": new FormControl(null, { validators: [Validators.required], updateOn: "change" }),
      "image": new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType]})
    })
    this.route.paramMap.subscribe((params: ParamMap) => {
      if(params.has("postid")) {
        this.mode = true;
        this.postId = params.get("postid");
        this.loading = true;
        this.postService.getPost(this.postId).subscribe(resp => {
          this.post = { id: resp._id, title: resp.title, content: resp.content, imagePath: resp.imagePath, creator: resp.creator };
          this.form.setValue({ title: this.post.title, content: this.post.content, image: this.post.imagePath })
          this.loading = false;
        });
      } else {
        this.mode = false;
        this.postId = undefined;
      }
    });
  }
  onAddPost() {
    if(this.form.invalid) {
      return false;
    }
    this.loading = true;
    if(this.mode) {
      this.postService.updatePost(this.postId,this.form.value.title,this.form.value.content, this.form.value.image);
    } else {
      this.postService.addPost(this.form.value.title,this.form.value.content, this.form.value.image);
    }

    this.form.reset();
  }

  onImageSelect(data: Event) {
    const file = (data.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imgPreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
