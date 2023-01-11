import { Injectable } from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { LoginRequest } from 'libs/auth/data-access-auth/src/lib/models/login-request.model';
import { Observable } from 'rxjs';
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
