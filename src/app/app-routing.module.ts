import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostlistComponent } from './posts/post-list/post-list.component';
import { CreatepostComponent } from './posts/create-post/create-post.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo:'view', pathMatch: 'full' },
  { path: 'view', component: PostlistComponent },
  { path: 'create', component: CreatepostComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postid', component: CreatepostComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: () => import("./auth/auth.module").then(mod => mod.AuthModule)}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}
