import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {ToastService} from "ng-uikit-pro-standard";
import {NotificationService} from "../../layouts/notification/notification.service";

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(private notiService: NotificationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(catchError((err) => this.handleError(err)));
  }

  handleError(err: HttpErrorResponse): Observable<any> {
    switch (err.status) {
      case 401:
        this.notiService.showError401();
        console.error('401 Unauthorizeddddddddddddddddd');
        // Navigate to error page
        break;
      case 0:
        this.notiService.showError('Connection refused!');
        break;
    }

    return throwError(err);
  }
}
