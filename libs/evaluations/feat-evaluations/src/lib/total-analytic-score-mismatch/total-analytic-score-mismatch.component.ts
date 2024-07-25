import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AcademicYear,
  TotalAnalyticScoresMismatchModel,
} from '@msh/shared/domain-models';
import { ExamQuestionScoreTotalsService } from '@msh/evaluations/data-access-evaluations';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SharedModule } from 'primeng/api';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { combineLatest, distinctUntilChanged, map, skip, tap } from 'rxjs';
import { AppBoolPipe, CustomSwitchComponent } from '@msh/shared/ui-shared';
@UntilDestroy()
@Component({
  selector: 'msh-total-analytic-score-mismatch',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    SharedModule,
    TableModule,
    CustomSwitchComponent,
    AppBoolPipe,
  ],
  templateUrl: './total-analytic-score-mismatch.component.html',
  styleUrls: ['./total-analytic-score-mismatch.component.scss'],
})
export class TotalAnalyticScoreMismatchComponent implements OnInit {
  scores: TotalAnalyticScoresMismatchModel[] = [];
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;
  isOn = false;
  currentAcademicYear!: Partial<AcademicYear>;

  constructor(
    private scoreApiService: ExamQuestionScoreTotalsService,
    private readonly authFacade: AuthFacade,
    private cd: ChangeDetectorRef
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    distinctUntilChanged(),
    map(([data]) => {
      this.currentAcademicYear = data;
      this.isOn = this.currentAcademicYear?.isFall ?? false;
      if (this.filters) {
        this.loadRows(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  onSwitchChange(event: any) {
    this.isOn = event;
    this.loadRows(this.filters as TableLazyLoadEvent);
  }

  ngOnInit(): void {
    this.academicYear$.pipe(untilDestroyed(this)).subscribe();
  }

  loadRows($event: TableLazyLoadEvent) {
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
      this.filters.filters = {};
    }

    this.scoreApiService
      .getExamScoreExamQuestionTotalMismatches(this.filters)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.scores = response.data;
        this.totalRecords = response.total;
        this.cd.detectChanges();
      });
  }
}
