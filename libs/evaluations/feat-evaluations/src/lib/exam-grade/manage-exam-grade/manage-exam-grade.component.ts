import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthFacade } from '@msh/auth/data-access-auth';
import {
  ExamGradeApiService
} from '@msh/evaluations/data-access-evaluations';
import { ExamGrade } from '@msh/shared/domain-models';
import { GlobalToastService, GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, PrimeTemplate } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { Ripple } from 'primeng/ripple';
import { TableLazyLoadEvent } from 'primeng/table';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import { ExamGradeChangesFormComponent } from '../../exam-grade-changes/exam-grade-changes-form/exam-grade-changes-form.component';
import { ManageExamGradeChangesComponent } from '../../exam-grade-changes/manage-exam-grade-changes/manage-exam-grade-changes.component';
import { RegradingGridComponent } from '../../regarding/regrading-grid/regrading-grid.component';
import { UploadComponent } from '../../regarding/upload/upload.component';
import { ExamGradeGridComponent } from '../exam-grade-grid/exam-grade-grid.component';

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
    ManageExamGradeChangesComponent
  ],
  templateUrl: './manage-exam-grade.component.html',
  styleUrl: './manage-exam-grade.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService, DialogService],
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
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
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
        case GRID_ACTIONS.DELETE:
          console.log('Delete two');
          this.confirmationService.confirm({
            message: 'Jeni i sigurt që doni ta fshini këtë notë?',
            accept: () => {
              this.deleteGrade(event.data as ExamGrade);
            },
          });
          break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  deleteGrade(examGrade: ExamGrade) {
    this.examGradeService
      .delete(examGrade.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Nota u fshi me sukses!');
          this.getGrade(this.filters as TableLazyLoadEvent);
        }
        if (!response.isSuccessful) {
              if (response.errorMessage) {
                this.toastService.showError(response.errorMessage);
              } else {
                this.toastService.showError('Ndonje një problem gjatë fshirjes së notës!');
              }
          }
      });
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
