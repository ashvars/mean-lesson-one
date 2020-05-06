import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  sub: Subscription;

  constructor(private authService: AuthService){ }

  ngOnInit() {
    this.sub = this.authService.getAuthStatus().subscribe(resp => {
      this.loading = false;
    });
  }

  onSignUp(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.loading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
