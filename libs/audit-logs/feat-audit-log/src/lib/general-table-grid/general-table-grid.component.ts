import { TableModule } from 'primeng/table';
import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { GeneralTableApiService } from '@msh/audit-logs/data-access-audit-log';
import { FormsModule } from '@angular/forms';
import { GlobalToastService } from '@msh/shared/util-shared';
import {Router} from "@angular/router";
import {GeneralTable} from "@msh/audit-logs/domain-audit-log";

@Component({
  selector: 'msh-general-table-grid',
  standalone: true,
  imports: [CommonModule, TableModule, RippleModule, ButtonModule, FormsModule,],
  templateUrl: './general-table-grid.component.html',
  styleUrls: ['./general-table-grid.component.scss'],
  providers: [Apollo],
})
export class GeneralTableGridComponent implements OnInit {
  auditTablesList: GeneralTable[] = [];
  tableNameFilter = '';


  constructor(
    private generalTableService: GeneralTableApiService,
    private toastService: GlobalToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.generalTableService.getAuditTablesList().subscribe(res => {
      if (res.isSuccessful) {
        this.auditTablesList = res.data;
      } else {
        res.errorMessage;
        this.toastService.showError(res.errorMessage);
      }
    });
  }


  navigateToTable(queryName: any) {
    if (queryName ) {
      this.router.navigateByUrl(`/audit-log/audit-log-grid?queryName=${queryName}`).then();
    }
  }
}
