import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { retryWhen, mergeMap } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  private maxRetries = 2;
  private retryDelayMs = 500;
  private retryStatusCodes = [0, 502, 503, 504];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error, retryCount) => {
            if (
              retryCount < this.maxRetries &&
              error instanceof HttpErrorResponse &&
              this.retryStatusCodes.includes(error.status)
            ) {
              return timer(this.retryDelayMs);
            }
            return throwError(() => error);
          })
        )
      )
    );
  }
}
