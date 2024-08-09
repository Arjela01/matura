import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  skip,
  tap,
} from 'rxjs';
import {
  AcademicYear,
  ExamQuestionScoreTotal,
  Student,
} from '@msh/shared/domain-models';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ExamQuestionScoreTotalsService } from '@msh/evaluations/data-access-evaluations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  ColumnFilterDirective,
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { ConfirmationService, SharedModule } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AppBoolPipe, CustomSwitchComponent } from '@msh/shared/ui-shared';
import { DialogModule } from 'primeng/dialog';
import { QuestionHistoryComponent } from '../question-history/question-history.component';

@UntilDestroy()
@Component({
  selector: 'msh-exam-question-score-total-grid',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    SharedModule,
    TableModule,
    TooltipModule,
    ConfirmDialogModule,
    CustomSwitchComponent,
    AppBoolPipe,
    DialogModule,
    QuestionHistoryComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './exam-question-score-total-grid.component.html',
  styleUrls: ['./exam-question-score-total-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamQuestionScoreTotalGridComponent implements OnInit {
  private records$$ = new BehaviorSubject<ExamQuestionScoreTotal[]>([]);
  analyticScoresList$ = this.records$$.asObservable();
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;
  isOn = false;
  currentAcademicYear!: Partial<AcademicYear>;
  id: any;
  headerText = '';
  displayHistoryForm = false;
  selectedRecord: any;

  constructor(
    private readonly examQuestionScoreTotalsService: ExamQuestionScoreTotalsService,
    private readonly router: Router,
    private readonly authFacade: AuthFacade,
    private readonly confirmationService: ConfirmationService,
    private readonly globalToastService: GlobalToastService
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    distinctUntilChanged(),
    map(([data]) => {
      this.currentAcademicYear = data;
      this.isOn = this.currentAcademicYear?.isFall ?? false;
      if (this.filters) {
        this.loadTableData(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  onSwitchChange(event: any) {
    this.isOn = event;
    this.loadTableData(this.filters as TableLazyLoadEvent);
  }

  ngOnInit(): void {
    this.academicYear$.pipe(untilDestroyed(this)).subscribe();
  }

  loadTableData($event: TableLazyLoadEvent | null) {
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

    this.examQuestionScoreTotalsService
      .loadTableData(this.filters)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.records$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  onEditClick(analyticScore: ExamQuestionScoreTotal) {
    this.router.navigate([
      `/evaluations/exam-question-score/${analyticScore.id}`,
    ]);
  }

  onHistoryClick(analyticScore: ExamQuestionScoreTotal) {
    this.displayHistoryForm = true;
    this.selectedRecord = analyticScore;
    this.id = analyticScore.id;
    this.headerText = `Historiku {${analyticScore.id}}`;
    this.displayHistoryForm = true;
  }

  onDeleteClick(item: any) {
    this.confirmationService.confirm({
      message: 'Jeni i sigurtë që doni të fshini pikët analitike?',
      accept: () => {
        this.examQuestionScoreTotalsService
          .delete(item.id)
          .subscribe(response => {
            if (response.isSuccessful) {
              this.globalToastService.showSuccess('Pikët u fshinë me sukses');
              this.loadTableData(this.filters);
            } else {
              this.globalToastService.showError('Ndodhi gabim gjatë fshirjes');
            }
          });
      },
    });
  }
}
