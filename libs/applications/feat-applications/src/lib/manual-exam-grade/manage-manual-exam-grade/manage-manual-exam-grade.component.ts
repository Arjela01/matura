import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { ManualExamGradeModel } from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ConfirmationService, SharedModule } from 'primeng/api';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { ExamSubjectApiService } from '@msh/configurations/data-access-configurations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ManualExamGradeService } from '@msh/applications/data-access-applications';
import { ExamGradeRequestFormComponent } from '../../exam-grade-request/exam-grade-request-form/exam-grade-request-form.component';
import { ExamGradeRequestGridComponent } from '../../exam-grade-request/exam-grade-request-grid/exam-grade-request-grid.component';
import { ManualExamGradeGridComponent } from '../manual-exam-grade-grid/manual-exam-grade-grid.component';
import { ManualExamGradeFormComponent } from '../manual-exam-grade-form/manual-exam-grade-form.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-manual-exam-grade',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    RippleModule,
    SharedModule,
    ExamGradeRequestFormComponent,
    ExamGradeRequestGridComponent,
    ManualExamGradeGridComponent,
    ManualExamGradeFormComponent,
  ],
  templateUrl: './manage-manual-exam-grade.component.html',
  styleUrls: ['./manage-manual-exam-grade.component.scss'],
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageManualExamGradeComponent implements OnInit {
  private manualExamGrade$$ = new BehaviorSubject<ManualExamGradeModel[]>([]);
  manualExamGrade$ = this.manualExamGrade$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  totalRecords = 0;

  selectedManualExamGrade: ManualExamGradeModel | null = null;
  displayModal = false;
  examSubjects: DropdownModel<string>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly manualExamGradeService: ManualExamGradeService,
    private readonly examSubjectService: ExamSubjectApiService,
    private cd: ChangeDetectorRef
  ) {}

  onNewClick() {
    this.displayModal = true;
    this.selectedManualExamGrade = {} as ManualExamGradeModel;
  }

  onModalClose() {
    this.displayModal = false;
  }
  ngOnInit() {
    this.getExamSubject();
  }

  onGridEvent(event: GridEvent<ManualExamGradeModel | ManualExamGradeModel[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.selectedManualExamGrade = Object.assign(
          {},
          event.data as ManualExamGradeModel
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurt që doni të fshini studentin e skualifikuar të zgjedhur?',
          accept: () => {
            this.deleteGrade(event.data as ManualExamGradeModel);
          },
        });
        break;
    }
  }
  onFormSave(manualExamGrade: ManualExamGradeModel) {
    if (manualExamGrade.id) {
      this.updateGrade(manualExamGrade);
    }
    if (!manualExamGrade.id) {
      this.addGrade(manualExamGrade);
    }
  }

  getGrades($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.manualExamGradeService.load($event).subscribe(response => {
      this.manualExamGrade$$.next(response.data);
      this.totalRecords = response.total;
      this.cd.markForCheck();
    });
  }

  addGrade(manualExamGrade: ManualExamGradeModel) {
    this.manualExamGradeService
      .save(manualExamGrade)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Nota u shtua me sukses!');
          this.displayModal = false;
          this.getGrades(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të notës!'
          );
        this.cd.markForCheck();
      });
  }

  updateGrade(manualExamGrade: ManualExamGradeModel) {
    this.manualExamGradeService
      .update(manualExamGrade)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Nota u ndryshua me sukses!');
          this.getGrades(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të notës!'
          );
        this.displayModal = false;
      });
  }

  deleteGrade(examGradeRequest: ManualExamGradeModel) {
    this.manualExamGradeService
      .delete(examGradeRequest.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Nota u fshi me sukses!');
          this.getGrades(this.filters as TableLazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes të notës!'
          );
      });
  }

  getExamSubject() {
    debugger;
    this.examSubjectService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(res => (this.examSubjects = res.data));
  }
}
