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
import * as FileSaver from "file-saver";

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

  downloadDocument(dashboardItem: DashboardItem) {
    const blob: any = new Blob(dashboardItem.document, {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(blob, dashboardItem.documentName);

  }
}
