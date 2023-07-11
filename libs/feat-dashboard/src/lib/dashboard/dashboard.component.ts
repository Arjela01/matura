import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { TableModule } from 'primeng/table';
import {DashboardItemsApiService, DashboardMetriciesApiService} from '@msh/configurations/data-access-configurations';
import {DashboardItem, DashboardMetrics, UserProfile} from '@msh/shared/domain-models';
import {UntilDestroy} from "@ngneat/until-destroy";
import {UserProfileApiService} from "@msh/user-section/data-access-user-section";

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
  userData:any;
  role:any;
  totalRecords = 0;
  submitted = false;
  id: any;
  loading = false;

  dashboardCards: DashboardItem[] = [];
  dashboardMetrics: DashboardMetrics ={

  totalStudents: 0,
  malePercentage: 0,
  femalePercentage: 0,
  a1ApplicationsPercentage: 0,
  a1ZApplicationsPercentage: 0,
  totalApplications: 0,
  id: 0,
}

  constructor(
    private cd: ChangeDetectorRef,
    private readonly dashboardItemsApiService: DashboardItemsApiService,
    private readonly dashboardMetriciesService: DashboardMetriciesApiService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserProfileApiService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getUser();
    this.dashboardMetriciesService
      .loadDashboardMetrics(this.id)
      .subscribe(result => {
        this.dashboardMetrics = {...result.data};
        this.cd.detectChanges();
      });
    this.dashboardItemsApiService.getAll().subscribe(result => {
      this.dashboardCards = [...result.data];
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
    const mimeType = 'application/pdf'
    const blob = new Blob([byteArray], { type: mimeType });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = dashboardItem.documentName;
    link.click();
  }
  getUser() {
    this.userService.getLoggedInUserData().subscribe(response => {
      this.userData = response.data
      this.role = response.data.roleName
    });
  }
}
