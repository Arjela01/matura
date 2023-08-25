import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchBoxService {
  private searchBoxVisibleSubject = new BehaviorSubject<boolean>(false);
  searchBoxVisible$: Observable<boolean> =
    this.searchBoxVisibleSubject.asObservable();
}
