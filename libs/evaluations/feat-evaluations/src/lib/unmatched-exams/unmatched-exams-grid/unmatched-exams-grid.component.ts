import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ExamScoreApiService } from '@msh/evaluations/data-access-evaluations';
import { TableLazyLoadEvent } from 'primeng/table';

import { AuthFacade } from '@msh/auth/data-access-auth';
import { AcademicYear, ExamScore } from '@msh/shared/domain-models';
import { AppBoolPipe, CustomSwitchComponent } from '@msh/shared/ui-shared';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TableModule } from 'primeng/table';
import { combineLatest, distinctUntilChanged, map, tap } from 'rxjs';

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
export class UnmatchedExamsGridComponent implements OnInit {
  unmatchedExams: ExamScore[] = [];
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;
  isOn = false;
  currentAcademicYear!: Partial<AcademicYear>;

  constructor(
    private readonly examScoreApiService: ExamScoreApiService,
    private readonly authFacade: AuthFacade,
    private readonly cd: ChangeDetectorRef
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    distinctUntilChanged(),
    map(([data]) => {
      this.currentAcademicYear = data;
      this.isOn = this.currentAcademicYear?.isFall ?? false;
      if (this.filters) {
        this.unmatchedExamScore(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  onSwitchChange(event: any) {
    this.isOn = event;
    this.unmatchedExamScore(this.filters as TableLazyLoadEvent);
  }

  ngOnInit(): void {
    this.academicYear$.pipe(untilDestroyed(this)).subscribe();
  }

  unmatchedExamScore($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    if (this.isOn && this.currentAcademicYear?.isFall) {
      this.filters.filters = {
        ...this.filters.filters,
        isFall: {
          value: this.currentAcademicYear.isFall,
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
