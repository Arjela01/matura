import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StudyProgramApiService } from '@msh/configurations/data-access-configurations';
import { StudyProgram } from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
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
import { StudyProgramFormComponent } from '../study-program-form/study-program-form.component';
import { StudyProgramGridComponent } from '../study-program-grid/study-program-grid.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-study-programs',
  standalone: true,
  templateUrl: './manage-study-programs.component.html',
  styleUrls: ['./manage-study-programs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    StudyProgramGridComponent,
    StudyProgramFormComponent,
  ],
})
export class ManageStudyProgramsComponent implements OnInit {
  private studyPrograms$$ = new BehaviorSubject<StudyProgram[]>([]);
  studyPrograms$ = this.studyPrograms$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedstudyProgram: StudyProgram | null = null;
  selectedstudyPrograms: StudyProgram[] = [];
  displayModal = false;

  universities: DropdownModel<number>[] = [];
  universityDepartaments: DropdownModel<number>[] = [];
  academicYears: DropdownModel<number>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly studyProgramService: StudyProgramApiService
  ) {}

  ngOnInit(): void {
    console.log('Init');
    this.getUniversities();
    this.getUniversityDepartaments();
    this.getAcademicYears();
  }

  onNewClick() {
    this.displayModal = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini programet e zgjedhura?',
      accept: () => {
        this.toastService.showWarning('Programi u fshi!');
      },
    });
  }

  onGridEvent(event: GridEvent<StudyProgram | StudyProgram[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedstudyPrograms = [
          ...this.selectedstudyPrograms,
          event.data as StudyProgram,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedstudyPrograms = this.selectedstudyPrograms.filter(sp => {
          sp.id !== (event.data as StudyProgram).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedstudyPrograms = [
          ...this.selectedstudyPrograms,
          ...(event.data as StudyProgram[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedstudyPrograms = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedstudyProgram = Object.assign(
          {},
          event.data as StudyProgram
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini programin e zgjedhur?',
          accept: () => {
            this.deleteStudyProgram(event.data as StudyProgram);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(studyProgram: StudyProgram) {
    if (studyProgram.id) {
      this.updateStudyProgram(studyProgram);
    }
    if (!studyProgram.id) {
      this.addStudyProgram(studyProgram);
    }
  }

  getStudyPrograms($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.studyProgramService
      .loadStudyPrograms($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.studyPrograms$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addStudyProgram(studyProgram: StudyProgram) {
    this.studyProgramService
      .save(studyProgram)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Programi i Studimit u shtua me sukses!'
          );
          this.displayModal = false;
          this.getStudyPrograms(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit së programit te studimit!'
          );
      });
  }

  updateStudyProgram(studyProgram: StudyProgram) {
    this.studyProgramService
      .update(studyProgram)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Programi i studimit u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getStudyPrograms(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit së programit te studimit!'
          );
      });
  }

  deleteStudyProgram(studyProgram: StudyProgram) {
    this.studyProgramService
      .delete(studyProgram.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Programi i Studimit u fshi me sukses!');
          this.getStudyPrograms(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë fshirjes së programit te studimit!'
          );
      });
  }

  getUniversities() {
    this.universities = [
      {
        key: 375,
        value: 'Polis',
      },
      {
        key: 295,
        value: 'Epoka',
      },
    ];
  }

  getUniversityDepartaments() {
    this.universityDepartaments = [
      {
        key: 211,
        value: 'Polis',
      },
      {
        key: 201,
        value: 'Epoka',
      },
    ];
  }

  getAcademicYears() {
    this.academicYears = [
      {
        key: 450,
        value: '2023',
      },
      {
        key: 430,
        value: '2022',
      },
    ];
  }
}
