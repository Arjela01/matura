import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { SharedModule } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { BehaviorSubject } from 'rxjs';
import { CalculationProcessesApiService } from '@msh/evaluations/data-access-evaluations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { backgroundColor } from 'html2canvas/dist/types/css/property-descriptors/background-color';
@UntilDestroy()
@Component({
  selector: 'msh-tableT',
  standalone: true,
  imports: [CommonModule, ColumnFilterDirective, SharedModule, TableModule],
  templateUrl: './tableT-grid.component.html',
  styleUrls: ['./tableT-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTGridComponent implements OnInit {
  private tableTData$$ = new BehaviorSubject<any[]>([]);
  tableTData$ = this.tableTData$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  event = {
    first: 0,
    rows: 10,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };

  constructor(
    // eslint-disable-next-line max-len
    private readonly calculationProcessesApiService: CalculationProcessesApiService
  ) {}
  ngOnInit() {
    this.getTableTData();
  }

  getTableTData() {
    this.calculationProcessesApiService
      .generateTableT(this.event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.tableTData$$.next(response.data);
      });
  }
}
