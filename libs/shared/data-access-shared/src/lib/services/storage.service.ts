import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class StorageService {
  abstract getItem<T>(key: string): T;
  abstract setItem<T>(key: string, value: T): void;
  abstract removeItem(key: string): void;
}
