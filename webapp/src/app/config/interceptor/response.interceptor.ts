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
  constructor(private nofiService: NotificationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(catchError((err) => this.handleError(err)));
  }

  handleError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401) {
      this.nofiService.showError401();
      console.error('401 Unauthorizeddddddddddddddddd');
      // Navigate to error page
    }
    return throwError(err);
  }
}
