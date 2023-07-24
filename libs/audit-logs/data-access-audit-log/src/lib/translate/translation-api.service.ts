import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  translations: any;
  constructor(private http: HttpClient) {
    this.getJson();
  }

  getJson() {
    this.http
      .get('assets/translation/translate.json')
      .subscribe((data: any) => {
        this.translations = data;
      });
  }

  translate(key: string): string {
    const keyString = String(key);
    if (this.translations && this.translations[key]) {
      return this.translations[key];
    }
    return keyString;
  }
}
