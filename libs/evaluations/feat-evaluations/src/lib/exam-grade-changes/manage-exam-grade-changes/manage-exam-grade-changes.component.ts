import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ConfirmationService, SharedModule } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { ExamGradeChange } from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { ExamGradeChangesApiService } from '@msh/evaluations/data-access-evaluations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExamGradeChangesGridComponent } from '../exam-grade-changes-grid/exam-grade-changes-grid.component';
import { ExamGradeChangesFormComponent } from '../exam-grade-changes-form/exam-grade-changes-form.component';
import { ExamSubjectApiService } from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ActivatedRoute, RouterLink } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-grade-changes',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    RippleModule,
    SharedModule,
    ExamGradeChangesGridComponent,
    ExamGradeChangesFormComponent,
    RouterLink,
  ],
  templateUrl: './manage-exam-grade-changes.component.html',
  styleUrls: ['./manage-exam-grade-changes.component.scss'],
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageExamGradeChangesComponent implements OnInit {
  private examGradeChange$$ = new BehaviorSubject<ExamGradeChange[]>([]);
  examGradeChange$ = this.examGradeChange$$.asObservable();

  examSubjects: DropdownModel<string>[] = [];
  examGradeChangeTypes: DropdownModel<string>[] = [];
  filters: TableLazyLoadEvent | null = {sortField: "sortField", sortOrder: -1};
  totalRecords = 0;
  selectedExamQuestion: ExamGradeChange | null = null;
  displayModal = false;
  academicYearId = 0;
  examGradeId = '';

  constructor(
    private readonly toastService: GlobalToastService,
    private readonly examGradeChangeService: ExamGradeChangesApiService,
    private readonly examSubjectService: ExamSubjectApiService,
    private readonly route: ActivatedRoute
  ) {
    const academicYear = JSON.parse(
      localStorage.getItem('academicYear') as string
    );
    if (academicYear) {
      this.academicYearId = academicYear.id;
    }
    this.examGradeId = this.route.snapshot.params['id'] ?? '';
  }

  ngOnInit() {
    this.getExamSubjects();
    this.getExamGradeChangeTypes();
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedExamQuestion = {} as ExamGradeChange;
  }

  onGridEvent(event: GridEvent<ExamGradeChange | ExamGradeChange[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.selectedExamQuestion = Object.assign(
          {},
          event.data as ExamGradeChange
        );
        this.displayModal = true;
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(examGradeChange: ExamGradeChange) {
    const valuesToSend = {
      ...examGradeChange,
      examGradeId: this.examGradeId,
    };
    if (!examGradeChange.id) {
      this.addExamGradeChange(valuesToSend);
    }
  }

  getExamGrades($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examGradeChangeService
      .loadData($event, this.examGradeId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examGradeChange$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  getExamSubjects() {
    this.examSubjectService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSubjects = response.data;
      });
  }

  getExamGradeChangeTypes() {
    this.examGradeChangeService
      .getExamGradeChangeType(this.academicYearId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examGradeChangeTypes = response.data;
      });
  }

  addExamGradeChange(examGradeChange: ExamGradeChange) {
    this.examGradeChangeService
      .save(examGradeChange)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Rivlërsimi u krye me sukses');
          this.displayModal = false;
          this.getExamGrades(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest)
          this.toastService.showError('Ndodhi një problem gjatë rivlërsimit!');
      });
  }
}
