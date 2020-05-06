import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const AUTH_URL = environment.domain + 'users/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private authStatus = new BehaviorSubject<boolean>(false);
  private isAuth: boolean = false;
  private tokenTimer: any;
  private userId: string;

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  isAuthenticated() {
    return this.isAuth;
  }

  createUser(email: string, password: string) {
    const user: AuthData = { email: email, password: password };
    this.http.post(AUTH_URL + "signup", user).subscribe(resp => {
      this.router.navigate(['/auth/login']);
    }, err => {
      this.authStatus.next(false);
    })
  }

  loginUser(email: string, password: string) {
    const user: AuthData = { email: email, password: password };
    this.http.post<{token: string, expiresIn: number, userId: string}>(AUTH_URL + "login", user).subscribe(resp => {
      this.token = resp.token;
      if(this.token) {
        const expiresIn = resp.expiresIn;
        this.setAuthTimer(expiresIn);
        this.authStatus.next(true);
        this.isAuth = true;
        this.userId = resp.userId;
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * 1000);
        this.saveAuthData(this.token, expirationDate, this.userId);
        this.router.navigate(['/']);
      }
    }, err => {
      this.authStatus.next(false);
    })
  }

  autoAuthUser() {
    const info = this.getAuthData();
    if(!info) {
      return;
    }
    const now = new Date();
    const isFuture = info.expirationDate.getTime() - now.getTime();
    if(isFuture > 0) {
      this.token = info.token;
      this.isAuth = true;
      this.userId = info.userId;
      this.authStatus.next(true);
      this.setAuthTimer(isFuture / 1000);
    }
  }

  logoutUser() {
    clearTimeout(this.tokenTimer);
    this.token = null;
    this.authStatus.next(false);
    this.isAuth = false;
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token',token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration')
    localStorage.removeItem('userId')
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if(!token || !expirationDate) {
      return;
    }
    return { token: token, expirationDate: new Date(expirationDate), userId: userId }
  }
}
