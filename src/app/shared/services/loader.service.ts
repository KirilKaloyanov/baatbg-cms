import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _loading = new BehaviorSubject<boolean>(false);
  loading$ = this._loading.asObservable();

  show() {
    this._loading.next(true);
  }

  hide() {
    this._loading.next(false);
  }

  private _loadingProgress = new BehaviorSubject<boolean>(false);
  loadingProgress$ = this._loadingProgress.asObservable();

  private _progressValue = new Subject<number>();
  progressValue$ = this._progressValue.asObservable();

  showProgress(value: number) {
    if (value == 0) {
      this._loading.next(true);
    } else {
      this._loading.next(false);
      this._loadingProgress.next(true);
      this._progressValue.next(value);
    }
  }

  hideProgress() {
    this._loadingProgress.next(false);
    this._loading.next(false);
  }
}
