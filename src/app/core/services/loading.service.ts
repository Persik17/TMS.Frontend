import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();
  private requestsCount = 0;

  show(): void {
    this.requestsCount++;
    if (this.requestsCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  hide(): void {
    if (this.requestsCount > 0) {
      this.requestsCount--;
    }
    if (this.requestsCount === 0) {
      this.loadingSubject.next(false);
    }
  }

  reset(): void {
    this.requestsCount = 0;
    this.loadingSubject.next(false);
  }
}
