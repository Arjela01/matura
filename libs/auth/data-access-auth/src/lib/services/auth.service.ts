import { Injectable } from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from './../models/login-response.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiService: APIService) {}

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse, LoginRequest>(
      '/Auth',
      loginRequest
    );
  }
}
