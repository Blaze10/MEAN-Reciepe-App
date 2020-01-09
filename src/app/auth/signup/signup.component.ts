import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit , OnDestroy {

  isLoading = false;
  private authSubs: Subscription;
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
    this.authService.signup(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authSubs.unsubscribe();
  }
}
