import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log(req.method);
    return next.handle(req).pipe(
      tap((evt) => {
        if (req.method !== 'GET' && evt instanceof HttpResponse) {
          if (evt.body && evt.body.message) {
            this.dialog.open(ErrorDialogComponent, {
              data: {title: 'Success', message: evt.body.message}
            });
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        this.dialog.open(ErrorDialogComponent, {
          data: {title: 'Error', message: error.error.message}
        });
        return throwError(error.error.message);
      })
    );
  }
}
