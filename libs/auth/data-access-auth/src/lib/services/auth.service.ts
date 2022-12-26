import { Injectable } from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import { LoginUser } from '../models/login-user.model';
import { UserResponse } from '../models/user-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //TODO: (WIP) Wire up login to backend
  constructor(private apiService: APIService) {}

  login(credentials: LoginUser): Observable<UserResponse> {
    return this.apiService.post<UserResponse, LoginUser>('login', credentials);
  }
}
