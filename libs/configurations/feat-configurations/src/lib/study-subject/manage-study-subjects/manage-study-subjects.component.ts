import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StudySubjectApiService } from '@msh/configurations/data-access-configurations';
import { StudySubject } from '@msh/shared/domain-models';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { StudySubjectFormComponent } from '../study-subject-form/study-subject-form.component';
import { StudySubjectGridComponent } from '../study-subject-grid/study-subject-grid.component';
import {RippleModule} from "primeng/ripple";

@UntilDestroy()
@Component({
  selector: 'msh-manage-study-subjects',
  standalone: true,
    imports: [
        ButtonModule,
        CommonModule,
        DialogModule,
        ConfirmDialogModule,
        ToolbarModule,
        StudySubjectFormComponent,
        StudySubjectGridComponent,
        RippleModule,
    ],
  templateUrl: './manage-study-subjects.component.html',
  styleUrls: ['./manage-study-subjects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageStudySubjectsComponent {
  private studySubjects$$ = new BehaviorSubject<StudySubject[]>([]);
  studySubjects$ = this.studySubjects$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedStudySubject: StudySubject | null = null;
  selectedStudySubjects: StudySubject[] = [];
  displayModal = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly studySubjectService: StudySubjectApiService
  ) {}

  onNewClick() {
    this.displayModal = true;
    this.selectedStudySubject = {} as StudySubject;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini lendet e zgjedhura?',
      accept: () => {
        this.toastService.showWarning('Subjects deleted!');
      },
    });
  }

  onGridEvent(event: GridEvent<StudySubject | StudySubject[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedStudySubjects = [
          ...this.selectedStudySubjects,
          event.data as StudySubject,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedStudySubjects = this.selectedStudySubjects.filter(ss => {
          ss.id !== (event.data as StudySubject).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedStudySubjects = [
          ...this.selectedStudySubjects,
          ...(event.data as StudySubject[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedStudySubjects = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedStudySubject = Object.assign(
          {},
          event.data as StudySubject
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini lenden e zgjedhur?',
          accept: () => {
            this.deleteStudySubject(event.data as StudySubject);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(studySubject: StudySubject) {
    if (studySubject.id) {
      this.updateStudySubject(studySubject);
    }
    if (!studySubject.id) {
      this.addStudySubject(studySubject);
    }
  }

  getStudySubjects($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.studySubjectService
      .loadStudySubjects($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.studySubjects$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addStudySubject(studySubject: StudySubject) {
    this.studySubjectService
      .save(studySubject)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Lenda e studimit u shtua me sukses!');
          this.displayModal = false;
          this.getStudySubjects(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit së lendes se studimit!'
          );
      });
  }

  updateStudySubject(studySubject: StudySubject) {
    this.studySubjectService
      .update(studySubject)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Lenda e Studimit u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getStudySubjects(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit së lendes se studimit!'
          );
      });
  }

  deleteStudySubject(studySubject: StudySubject) {
    this.studySubjectService
      .delete(studySubject.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Lenda e studimit u fshi me sukses!');
          this.getStudySubjects(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë fshirjes së lendes se studimit!'
          );
      });
  }
}
