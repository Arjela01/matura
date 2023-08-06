import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthFacade } from '@msh/auth/data-access-auth';
import {
  ExamSubjectApiService,
  ExamTypeApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ExamSubject } from '@msh/shared/domain-models';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ExamSubjectFormComponent } from '../exam-subject-form/exam-subject-form.component';
import { ExamSubjectGridComponent } from '../exam-subject-grid/exam-subject-grid.component';
import * as FileSaver from 'file-saver';
import { TableLazyLoadEvent } from 'primeng/table';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-subject',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    ExamSubjectFormComponent,
    ExamSubjectGridComponent,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './manage-exam-subject.component.html',
  styleUrls: ['./manage-exam-subject.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamSubjectComponent implements OnInit {
  private examSubjects$$ = new BehaviorSubject<ExamSubject[]>([]);
  examSubjects$ = this.examSubjects$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  totalRecords = 0;
  selectedExamSubjects: ExamSubject[] = [];
  selectedExamSubject: ExamSubject | null = null;
  displayModal = false;

  examTypes: DropdownModel<number>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examSubjectService: ExamSubjectApiService,
    private readonly examTypesApiService: ExamTypeApiService,
    private authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    map(([_]) => {
      if (this.filters) {
        this.getExamSubjects(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );
  ngOnInit(): void {
    this.getExamTypesDropdown();
    this.authFacade.academicYear$
      .pipe(
        map((data: any) => data.id),
        distinctUntilChanged(),
        switchMap(data => {
          if (this.filters) {
            window.location.reload();
          }

          return of([]);
        })
      )
      .subscribe();
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedExamSubject = {
      isNotGraded: false,
      isOptional: false,
    } as ExamSubject;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini lëndët provimeve të zgjedhura?',
      accept: () => {
        //this.highSchoolStore.deleteSelectedHighSchools();
        this.toastService.showWarning('');
      },
    });
  }

  onGridEvent(event: GridEvent<ExamSubject | ExamSubject[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedExamSubjects = [
          ...this.selectedExamSubjects,
          event.data as ExamSubject,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedExamSubjects = this.selectedExamSubjects.filter(es => {
          es.id !== (event.data as ExamSubject).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedExamSubjects = [
          ...this.selectedExamSubjects,
          ...(event.data as ExamSubject[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedExamSubjects = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedExamSubject = Object.assign({}, event.data as ExamSubject);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurt që doni të fshini lëndën e provimit të zgjedhur?',
          accept: () => {
            this.deleteExamSubject(event.data as ExamSubject);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(examSubject: ExamSubject) {
    if (examSubject.id) {
      this.updateExamSubject(examSubject);
    }
    if (!examSubject.id) {
      this.addExamSubject(examSubject);
    }
  }

  getExamSubjects($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examSubjectService
      .loadExamSubjects($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSubjects$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addExamSubject(examSubject: ExamSubject) {
    this.examSubjectService
      .save(examSubject)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Lënda e provimit u shtua me sukses!');
          this.displayModal = false;
          this.getExamSubjects(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së lëndës së provimit të zgjedhur!'
          );
      });
  }

  updateExamSubject(examSubject: ExamSubject) {
    this.examSubjectService
      .update(examSubject)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Lënda e provimit u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getExamSubjects(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së lëndës së provimit të zgjedhur!'
          );
      });
  }

  deleteExamSubject(examSubject: ExamSubject) {
    this.examSubjectService
      .delete(examSubject.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Lënda e provimit u fshi me sukses!');
          this.getExamSubjects(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së lëndës së provimit!'
          );
      });
  }
  getExamTypesDropdown() {
    this.examTypesApiService.loadDropdownList().subscribe(response => {
      this.examTypes = response.data;
    });
  }

  downloadTemplateFile() {
    this.examSubjectService
      .exportTemplate()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        const blob: any = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, 'LëndëProvimi_Template');
      });
  }
}
