import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = '/api';

@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!/^https?:\/\//i.test(req.url)) {
      const apiReq = req.clone({ url: API_URL + req.url });
      return next.handle(apiReq);
    }
    return next.handle(req);
  }
}
