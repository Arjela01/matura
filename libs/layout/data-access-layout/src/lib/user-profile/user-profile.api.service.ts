import { Injectable} from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import { UserProfile } from '@msh/layout/domain-layout';

@Injectable({
  providedIn: 'root',
})
export class UserProfileApiService {
  constructor(private apiService: APIService) {}

  getUserProfile(): Observable<UserProfile> {
    return this.apiService.get(`/UserProfile`);
  }
}
