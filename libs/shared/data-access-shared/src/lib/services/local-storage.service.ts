import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService implements StorageService {
  getItem<T>(key: string): T {
    const value = JSON.parse(localStorage.getItem(key) ?? 'null');
    return value;
  }

  setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
