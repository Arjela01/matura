import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  DashboardItemsApiService,
  DashboardMetriciesApiService,
} from '@msh/configurations/data-access-configurations';
import { ApiResult } from '@msh/shared/data-access-shared';
import {
  DashboardItem,
  DashboardMetrics,
  UserProfile,
} from '@msh/shared/domain-models';
import { UserProfileApiService } from '@msh/user-section/data-access-user-section';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Observable, combineLatest } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'msh-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  userData: any;
  role: any;
  totalRecords = 0;
  submitted = false;
  id: any;
  loading = false;

  dashboardItems: Map<string, DashboardItem[]> = new Map<
    string,
    DashboardItem[]
  >();
  dashboardSections: string[] = [];
  dashboardMetrics: DashboardMetrics = {
    totalStudents: 0,
    malePercentage: 0,
    femalePercentage: 0,
    a1ApplicationsPercentage: 0,
    a1ZApplicationsPercentage: 0,
    totalApplications: 0,
    id: 0,
  };

  constructor(
    private cd: ChangeDetectorRef,
    private readonly dashboardItemsApiService: DashboardItemsApiService,
    private readonly dashboardMetriciesService: DashboardMetriciesApiService,
    private route: ActivatedRoute,
    private userService: UserProfileApiService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    combineLatest([
      this.getUser(),
      this.getDashboardMetricrs(),
      this.getDashboardSections(),
    ]).subscribe(([users, metrics, sections]) => {
      this.userData = users.data;
      this.role = users.data.roleName;
      const items = [...sections.data];
      this.dashboardMetrics = { ...metrics.data };
      this.dashboardSections = [
        ...new Set(sections.data.map(e => String(e.dashboardSectionName))),
      ];
      for (const section of this.dashboardSections) {
        this.dashboardItems.set(
          section,
          items.filter(i => i.dashboardSectionName === section)
        );
      }
      this.cd.detectChanges();
    });
  }

  downloadDocument(dashboardItem: DashboardItem) {
    const byteCharacters = atob(dashboardItem.document);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const mimeType = 'application/pdf';
    const blob = new Blob([byteArray], { type: mimeType });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = dashboardItem.documentName;
    link.click();
  }

  getUser(): Observable<ApiResult<UserProfile>> {
    return this.userService.getLoggedInUserData();
  }
  getDashboardMetricrs(): Observable<ApiResult<any>> {
    return this.dashboardMetriciesService.loadDashboardMetrics(this.id);
  }
  getDashboardSections(): Observable<ApiResult<DashboardItem[]>> {
    return this.dashboardItemsApiService.forHome();
  }
}
