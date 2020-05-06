import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CreatepostComponent } from './create-post/create-post.component';
import { PostlistComponent } from './post-list/post-list.component';
import { AngularmaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    CreatepostComponent,
    PostlistComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularmaterialModule,
    RouterModule
  ]
})
export class PostsModule {

}
