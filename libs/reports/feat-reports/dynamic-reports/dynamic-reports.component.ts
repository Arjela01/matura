import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Reports } from '@msh/configurations/domain-configurations';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-dynamic-reports',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
  ],
  templateUrl: './dynamic-reports.component.html',
  styleUrls: ['./dynamic-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicReportsComponent {
  @Input() reports: any[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedReports: Reports[] = [];

  @Output() gridEvent = new EventEmitter<GridEvent<any | any[]>>();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  constructor(private router: Router) {}
  onViweClick(reports: any) {
    this.router.navigate([`reports/${reports.reportId}`]);
  }

  onDeleteClick(reports: any) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: reports,
    } as GridEvent<Reports>);
  }

  onSelectAllClick() {
    if (this.selectedReports.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<Reports>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedReports,
      } as GridEvent<Reports[]>);
    }
  }

  onRowSelect({ data }: { data: any }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<Reports>);
  }

  onRowUnselect({ data }: { data: any }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<Reports>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
