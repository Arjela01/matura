import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuItemClickService {
  private menuItemClickedSubject = new BehaviorSubject<boolean>(false);

  setMenuItemClicked(value: boolean) {
    this.menuItemClickedSubject.next(value);
  }

  get menuItemClicked$(): Observable<boolean> {
    return this.menuItemClickedSubject.asObservable();
  }
}
