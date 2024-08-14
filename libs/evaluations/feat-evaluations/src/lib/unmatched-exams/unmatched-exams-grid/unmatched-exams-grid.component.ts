import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ExamScoreApiService } from '@msh/evaluations/data-access-evaluations';
import { TableLazyLoadEvent } from 'primeng/table';

import { AuthFacade } from '@msh/auth/data-access-auth';
import { ExamScore } from '@msh/shared/domain-models';
import { AppBoolPipe } from '@msh/shared/ui-shared';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TableModule } from 'primeng/table';
import { combineLatest, distinctUntilChanged, skip, tap } from 'rxjs';
import { CustomSwitchComponent } from '@msh/layout/feat-layout';

@UntilDestroy()
@Component({
  selector: 'msh-unmatched-exams-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ColumnFilterDirective,
    AppBoolPipe,
    CustomSwitchComponent,
  ],
  templateUrl: './unmatched-exams-grid.component.html',
  styleUrls: ['./unmatched-exams-grid.component.scss'],
})
export class UnmatchedExamsGridComponent {
  unmatchedExams: ExamScore[] = [];
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;
  isOn = false;

  constructor(
    private readonly examScoreApiService: ExamScoreApiService,
    private readonly authFacade: AuthFacade,
    private readonly cd: ChangeDetectorRef
  ) {}

  changes$ = combineLatest([
    this.authFacade.academicYear$.pipe(skip(1)),
    this.authFacade.isFall$.pipe(
      tap(isFall => {
        this.isOn = isFall;
      })
    ),
  ])
    .pipe(
      distinctUntilChanged(),
      skip(1),
      untilDestroyed(this),
      tap(() => {
        if (this.filters) {
          this.unmatchedExamScore(this.filters as TableLazyLoadEvent);
        }
      })
    )
    .subscribe();

  onSwitchChange(event: any) {
    this.isOn = event;
    this.unmatchedExamScore(this.filters as TableLazyLoadEvent);
  }

  unmatchedExamScore($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    if (this.isOn) {
      this.filters.filters = {
        ...this.filters.filters,
        isFall: {
          value: this.isOn,
          matchMode: 'equals',
        },
      };
    } else {
      const { isFall, ...restFilters } = this.filters.filters || {};
      this.filters.filters = restFilters;
    }

    this.examScoreApiService
      .loadUnmatchedExamScores(this.filters)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.unmatchedExams = response.data;
        this.totalRecords = response.total;
        this.cd.detectChanges();
      });
  }
}
