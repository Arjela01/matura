import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { SystemFeatureModel, SystemFeatView } from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class SystemFeatService {
  constructor(private apiService: APIService) {}

  loadFeatures(): Observable<SystemFeatView> {
    return this.apiService.get(`/SystemFeature`);
  }

  update(feat: SystemFeatureModel): Observable<ApiResult<SystemFeatureModel>> {
    return this.apiService.post<
      ApiResult<SystemFeatureModel>,
      SystemFeatureModel
    >(`/SystemFeature/Update`, feat);
  }
}
