import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import { ExamGrade } from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  ExamGradeApiService,
  RegradingApiService,
} from '@msh/evaluations/data-access-evaluations';
import { ButtonDirective } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { PrimeTemplate } from 'primeng/api';
import { Ripple } from 'primeng/ripple';
import { ExamGradeChangesFormComponent } from '../../exam-grade-changes/exam-grade-changes-form/exam-grade-changes-form.component';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { RegradingGridComponent } from '../../regarding/regrading-grid/regrading-grid.component';
import { UploadComponent } from '../../regarding/upload/upload.component';
import { ExamGradeGridComponent } from '../exam-grade-grid/exam-grade-grid.component';
import { ManageExamGradeChangesComponent } from '../../exam-grade-changes/manage-exam-grade-changes/manage-exam-grade-changes.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-grade',
  standalone: true,
  imports: [
    CommonModule,
    ButtonDirective,
    ConfirmDialogModule,
    DialogModule,
    PrimeTemplate,
    Ripple,
    ExamGradeChangesFormComponent,
    RegradingGridComponent,
    UploadComponent,
    ExamGradeGridComponent,
    ManageExamGradeChangesComponent,
  ],
  templateUrl: './manage-exam-grade.component.html',
  styleUrl: './manage-exam-grade.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageExamGradeComponent {
  private examGrades$$ = new BehaviorSubject<ExamGrade[]>([]);
  examGrades$ = this.examGrades$$.asObservable();

  filters: TableLazyLoadEvent | null = null;
  selectedGrade: ExamGrade | null = null;
  totalRecords = 0;
  displayModal = false;
  academicYearId = 0;
  examGradeId: any;

  constructor(
    private readonly authFacade: AuthFacade,
    private readonly examGradeService: ExamGradeApiService
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getGrade(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  onNewClick() {
    this.displayModal = true;
    this.selectedGrade = {} as ExamGrade;
  }

  onGridEvent(event: GridEvent<ExamGrade | ExamGrade[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.selectedGrade = Object.assign({}, event.data as ExamGrade);
        this.examGradeId = this.selectedGrade.id;
        this.displayModal = true;
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  getGrade($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examGradeService
      .loadExamGrades($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examGrades$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
