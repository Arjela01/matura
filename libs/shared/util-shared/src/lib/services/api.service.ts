import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../constants/api-url.token';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  //TODO: Add logger service to log external http calls
  private headers: HttpHeaders;
  constructor(
    private http: HttpClient,
    @Inject(API_URL) private api_url: string
  ) {
    this.headers = this.getHeaders();
  }

  get<T>(
    url: string,
    params: HttpParams = new HttpParams(),
    responseType = 'json'
  ): Observable<T> {
    return this.http.get<T>(`${this.api_url}${url}`, {
      headers: this.headers,
      params,
      responseType: responseType !== 'json' ? (responseType as 'json') : 'json',
    });
  }

  getData<T>(
    url: string,
    params: any,
    responseType = 'json'
  ): Observable<T> {
    return this.http.get<T>(`${this.api_url}${url}`, {
      headers: this.headers,
      params,
      responseType: responseType !== 'json' ? (responseType as 'json') : 'json',
    });
  }

  post<T, D>(url: string, data?: D): Observable<T> {
    return this.http.post<T>(`${this.api_url}${url}`, data, {
      headers: this.headers,
    });
  }

  postWithParams<T, D>(url: string, data?: D, params?: any): Observable<T> {
    return this.http.post<T>(`${this.api_url}${url}`, data, {
      params,
    });
  }

  put<T, D>(url: string, data: D, responseType = 'json'): Observable<T> {
    return this.http.put<T>(`${this.api_url}${url}`, data, {
      headers: this.headers,
      responseType: responseType !== 'json' ? (responseType as 'json') : 'json',
    });
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.api_url}${url}`, {
      headers: this.headers,
    });
  }

  getHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    return new HttpHeaders(headersConfig);
  }

  // eslint-disable-next-line max-len
  getById<T>(
    url: string,
    params: HttpParams = new HttpParams()
  ): Observable<T> {
    return this.http.get<T>(`${this.api_url}${url}`, {
      headers: this.headers,
      params,
    });
  }
}
