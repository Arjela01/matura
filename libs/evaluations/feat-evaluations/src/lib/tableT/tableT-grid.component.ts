import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { SharedModule } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import { CalculationProcessesApiService } from '@msh/evaluations/data-access-evaluations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthFacade } from '@msh/auth/data-access-auth';

@UntilDestroy()
@Component({
  selector: 'msh-table-t',
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
  totalRecords!: number;
  event = {
    first: 0,
    rows: 100000000,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };

  constructor(
    private readonly calculationProcessesApiService: CalculationProcessesApiService,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      this.getTableTData();
    }),
    tap()
  );

  ngOnInit() {
    this.getTableTData();
  }

  getTableTData() {
    this.calculationProcessesApiService
      .generateTableT(this.event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.tableTData$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
