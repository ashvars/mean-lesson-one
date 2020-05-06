import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  sub: Subscription;
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.sub = this.authService.getAuthStatus().subscribe(resp => {
      this.isAuthenticated = resp;
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onLogout() {
    this.authService.logoutUser();
  }
}
