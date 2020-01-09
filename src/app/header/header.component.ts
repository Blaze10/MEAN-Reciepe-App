import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authSubs: Subscription;
  isUserAuthenticated = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isUserAuthenticated = this.authService.getAuthStatus();
    this.authSubs = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.isUserAuthenticated = isAuth;
    });
  }

  ngOnDestroy() {
    this.authSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

}
