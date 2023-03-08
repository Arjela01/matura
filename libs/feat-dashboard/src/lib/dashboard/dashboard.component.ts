import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { DashboardItemsApiService } from '@msh/configurations/data-access-configurations';
import { DashboardItem } from '@msh/shared/domain-models';

@Component({
  selector: 'msh-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  totalRecords = 0;
  submitted = false;
  id: any;
  loading = false;

  dashboardCards: DashboardItem[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private readonly dashboardItemsApiService: DashboardItemsApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.dashboardItemsApiService.getAll().subscribe(result => {
      this.dashboardCards = [...result.data];
      this.cd.detectChanges();
    });
  }
}
