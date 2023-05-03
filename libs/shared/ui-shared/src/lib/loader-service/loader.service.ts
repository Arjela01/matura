import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor() { }

  setLoading(loading: boolean) {
    this.loading.next(loading);
  }

  getLoading(): boolean {
    return this.loading.value;
  }
}
