import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

const BackendUrl = environment.apiUrl + '/user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private token;
  private userId;
  tokenTimer;

  constructor(private http: HttpClient, private router: Router) { }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  signup(email: string, password: string) {
    this.http.post<{ message: string }>(BackendUrl + '/signup', { email: email, password: password })
      .subscribe(res => {
        console.log(res.message);
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string) {
    this.http.post<{ message: string, token: string, expiresIn: number, userId: string }>(BackendUrl + '/login',
      { email: email, password: password })
      .subscribe(response => {
        const token = response.token;
        if (token) {
          this.token = token;
          this.userId = response.userId;
          const expiresIn = response.expiresIn;
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.setAuthTimer(expiresIn);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  logout() {
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.setAuthTimer(expiresIn / 1000);
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
    }
  }

  saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  getAuthData() {
    const authToken = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!authToken ||  !expirationDate) {
      return;
    }
    return {token: authToken, expirationDate: new Date(expirationDate), userId: userId};
  }

  setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {

    }, duration * 1000);
  }

}
