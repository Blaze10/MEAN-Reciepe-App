import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReciepeService } from '../reciepe.service';
import { Reciepe } from '../reciepe.model';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-reciepe-list',
  templateUrl: './reciepe-list.component.html',
  styleUrls: ['./reciepe-list.component.css']
})
export class ReciepeListComponent implements OnInit, OnDestroy {

  constructor(private recipeService: ReciepeService, private authService: AuthService) { }
  reciepesList: Reciepe[] = [];
  isLoading = false;

  currentPageSize = 2;
  totalReciepes = 0;
  pageSizeOptions = [1, 2, 20, 50];
  currentPage = 1;
  private authSubs: Subscription;
  isUserAuthenticated = false;
  userId: string;

  ngOnInit() {
    this.getReciepes(this.currentPageSize, this.currentPage);
    this.userId = this.authService.getUserId();
    this.isUserAuthenticated = this.authService.getAuthStatus();
    this.authSubs = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.isUserAuthenticated = isAuth;
      this.userId = this.authService.getUserId();
    });
  }

  getReciepes(pageSize, page) {
    this.isLoading = true;
    this.recipeService.getReciepes(pageSize, page)
    .subscribe(response => {
      this.isLoading = false;
      this.reciepesList = response.reciepes;
      this.totalReciepes = response.count;
      console.log(this.reciepesList);
    });
  }

  onDeleteReciepe(reciepeId: string) {
    this.recipeService.deleteReciepe(reciepeId)
    .subscribe((res) => {
      this.getReciepes(this.currentPageSize, this.currentPage);
    });
  }

  onChangePage(event: PageEvent) {
    this.currentPageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.getReciepes(this.currentPageSize, this.currentPage);
  }

  ngOnDestroy() {
    this.authSubs.unsubscribe();
  }

}
