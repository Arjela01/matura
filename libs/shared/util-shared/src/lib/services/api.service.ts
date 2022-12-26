import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../constants/api-url.token';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  //TODO: Add logger service to log external http calls

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private api_url: string
  ) {}

  get<T>(url: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.api_url}${url}`, {
      headers: this.headers,
      params,
    });
  }

  post<T, D>(url: string, data?: D): Observable<T> {
    return this.http.post<T>(`${this.api_url}${url}`, data, {
      headers: this.headers,
    });
  }

  put<T, D>(url: string, data: D): Observable<T> {
    return this.http.put<T>(`${this.api_url}${url}`, data, {
      headers: this.headers,
    });
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.api_url}${url}`, {
      headers: this.headers,
    });
  }

  get headers(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    return new HttpHeaders(headersConfig);
  }
}
