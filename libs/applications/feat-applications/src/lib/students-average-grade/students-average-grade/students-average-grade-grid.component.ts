import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import {
  Student,
  TotalScoresWithoutAnalyticModel,
} from '@msh/shared/domain-models';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TotalScoresWithoutAnalyticService } from '@msh/evaluations/data-access-evaluations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { SharedModule } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { AverageGradeService } from '@msh/applications/data-access-applications';

@UntilDestroy()
@Component({
  selector: 'msh-students-average-grade',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    SharedModule,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './students-average-grade-grid.component.html',
  styleUrls: ['./students-average-grade-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsAverageGradeGridComponent {
  private avgGradeList$$ = new BehaviorSubject<Student[]>([]);
  avgGradeList$ = this.avgGradeList$$.asObservable();

  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;

  constructor(
    private readonly avgGradeService: AverageGradeService,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getAverageGrades(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  getAverageGrades($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.avgGradeService
      .loadData($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.avgGradeList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
