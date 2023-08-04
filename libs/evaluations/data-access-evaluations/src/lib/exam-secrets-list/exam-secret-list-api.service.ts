import { Injectable } from '@angular/core';

import { APIService } from '@msh/shared/util-shared';

@Injectable({
  providedIn: 'root',
})
export class ExamSecretListApiService {
  constructor(private apiService: APIService) {}
}
