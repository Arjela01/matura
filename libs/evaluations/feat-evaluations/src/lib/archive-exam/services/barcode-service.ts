import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BarcodeService {
  private emptyBarcodeField$$ = new BehaviorSubject<boolean>(true);
  emptyBarcodeField$ = this.emptyBarcodeField$$.asObservable();

  public emptyBarcodeField() {
    this.emptyBarcodeField$$.next(true);
  }
}
