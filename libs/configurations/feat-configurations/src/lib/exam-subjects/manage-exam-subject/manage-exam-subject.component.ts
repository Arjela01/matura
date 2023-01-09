import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToolbarModule} from "primeng/toolbar";
import {ExamSubjectFormComponent} from "../exam-subject-form/exam-subject-form.component";
import {ExamSubjectGridComponent} from "../exam-subject-grid/exam-subject-grid.component";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {BehaviorSubject} from "rxjs";
import {ExamSubject, HighSchool} from "@msh/configurations/domain-configurations";
import {GlobalToastService, GRID_ACTIONS, GridEvent} from "@msh/shared/util-shared";
import {
  ExamSubjectApiService
} from "@msh/configurations/data-access-configurations";
import {untilDestroyed} from "@ngneat/until-destroy";

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
    ToolbarModule,],
  templateUrl: './manage-exam-subject.component.html',
  styleUrls: ['./manage-exam-subject.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],

})
export class ManageExamSubjectComponent {
  private examSubjects$$ = new BehaviorSubject<ExamSubject[]>([])
  private examSubjects$ = this.examSubjects$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedExamSubjects: ExamSubject[] = []
  selectedExamSubject: ExamSubject | null = null;
  displayModal = false;


  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examSubjectService: ExamSubjectApiService,

  ) {
  }

  onNewClick() {
    this.displayModal = true;
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
          message: 'Jeni i sigurt që doni të fshini lëndën e provimit të zgjedhur?',
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

  onFormSave(examSubject: ExamSubject){
    if(examSubject.id){
      this.updateExamSubject(examSubject)
    }
    if(!examSubject.id){
      this.addExamSubject(examSubject)
    }
  }

  getExamSubjects($event: LazyLoadEvent){
    this.filters = Object.assign({}, $event);

    this.examSubjectService
      .loadExamSubjects($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSubjects$$.next(response.data);
        this.totalRecords = response.total
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
          this.getExamSubjects(this.filters as LazyLoadEvent);
        }

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
          this.getExamSubjects(this.filters as LazyLoadEvent);
        }

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
          this.getExamSubjects(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së lëndës së provimit!'
          );
      });
  }

}
