import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { SharedModule } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { BehaviorSubject } from 'rxjs';
import { CalculationProcessesApiService } from '@msh/evaluations/data-access-evaluations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

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
  event = {
    first: 0,
    rows: 100000000,
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
        const modifiedData = response.data.map(
          (item: { birthDate: string }) => {
            if (item.birthDate) {
              const dateParts = item.birthDate.split(' ')[0].split('.');
              const formattedDate = `${('0' + dateParts[0]).slice(-2)}/${(
                '0' + dateParts[1]
              ).slice(-2)}/${dateParts[2]}`;
              item.birthDate = formattedDate;
            }
            return item;
          }
        );

        this.tableTData$$.next(modifiedData);
      });
  }
}
