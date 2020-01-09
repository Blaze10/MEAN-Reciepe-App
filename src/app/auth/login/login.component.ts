import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  authSubs: Subscription;
  isLoading = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authSubs = this.authService.getAuthStatusListener().subscribe(autStatus => {
      this.isLoading = false;
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authSubs.unsubscribe();
  }

}
