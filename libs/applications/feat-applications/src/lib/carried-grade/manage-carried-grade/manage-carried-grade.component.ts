import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CarriedGrade } from '@msh/applications/domain-application';
import {
  AcademicYearApiService,
  CarriedGradeApiService,
  ExamSubjectApiService,
  ExamTypeApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';

import { ActivatedRoute } from '@angular/router';
import { Student } from '@msh/shared/domain-models';
import {
  SharedStudent,
  SharedStudentLookupModule,
} from '@msh/shared/student-lookup';
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
import { TableLazyLoadEvent } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import { CarriedGradesFormComponent } from '../carried-grade-form/carried-grade-form.component';
import { CarriedGradesGridComponent } from '../carried-grade-grid/carried-grades-grid.component';
import { AuthFacade } from '@msh/auth/data-access-auth';

@Component({
  selector: 'msh-manage-carried-grades',
  standalone: true,
  templateUrl: './manage-carried-grade.component.html',
  styleUrls: ['./manage-carried-grade.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    CarriedGradesGridComponent,
    ToolbarModule,
    RippleModule,
    CarriedGradesFormComponent,
    SharedStudentLookupModule,
  ],
})
@UntilDestroy()
export class ManageCarriedGradesComponent implements OnInit {
  private carriedGrades$$ = new BehaviorSubject<CarriedGrade[]>([]);
  carriedGrades$ = this.carriedGrades$$.asObservable();
  filters: TableLazyLoadEvent = {} as TableLazyLoadEvent;

  totalRecords = 0;
  selectedCarriedGrade?: CarriedGrade;
  selectedCarriedGrades: CarriedGrade[] = [];
  displayModal = false;

  examTypeDropdown: DropdownModel<number>[] = [];
  examSubjectsDropdown: DropdownModel<string>[] = [];
  academicYearsDropdown: DropdownModel<number>[] = [];

  nid: string | undefined = undefined;
  showStudentSearchButton = true;
  studentInputData = '';
  showStudentModal = false;
  selectedStudent?: SharedStudent;

  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  totalStudentRecords = 0;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private carriedGradeApiService: CarriedGradeApiService,
    private examTypeApiService: ExamTypeApiService,
    private academicYearApiService: AcademicYearApiService,
    private studentsApiService: StudentsApiService,
    private examSubjectApiService: ExamSubjectApiService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getCarriedGrades(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  ngOnInit(): void {
    this.getAcademicYearsDropdown();
    this.getExamTypeDropdown();

    this.route.queryParams.subscribe(params => {
      this.nid = params['nid'];

      if (this.nid) {
        this.onNewClick();
      }
    });
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedCarriedGrade = {} as CarriedGrade;
  }

  onGridEvent(event: GridEvent<CarriedGrade | CarriedGrade[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedCarriedGrades = [
          ...this.selectedCarriedGrades,
          event.data as CarriedGrade,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedCarriedGrades = this.selectedCarriedGrades.filter(rep => {
          rep.id !== (event.data as CarriedGrade).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedCarriedGrades = [
          ...this.selectedCarriedGrades,
          ...(event.data as CarriedGrade[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedCarriedGrades = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.displayModal = true;
        this.selectedCarriedGrade = Object.assign(
          {},
          event.data as CarriedGrade
        );
        this.getSubjectsDropdown({
          examTypeId: this.selectedCarriedGrade.examTypeId,
          academicYearId: this.selectedCarriedGrade.academicYearId,
        });
        break;
      case GRID_ACTIONS.CUSTOM_ACTION2:
        this.downloadDocument(event.data as CarriedGrade);
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt për fshirjen e notës?',
          accept: () => {
            this.deleteCarriedGrades(event.data as CarriedGrade);
          },
        });
        break;
    }
  }

  downloadDocument(carriedGrade: CarriedGrade) {
    this.carriedGradeApiService.downloadDocument(carriedGrade);
  }

  onModalClose() {
    this.displayModal = false;
    this.selectedCarriedGrade = undefined;
  }

  onFormSave(carriedGrade: CarriedGrade) {
    if (carriedGrade.id) {
      this.updateCarriedGrade(carriedGrade);
    }
    if (!carriedGrade.id) {
      this.addCarriedGrade(carriedGrade);
    }
  }

  getCarriedGrades($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);
    this.carriedGradeApiService
      .loadCarriedGrades($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.carriedGrades$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addCarriedGrade(carriedGrades: CarriedGrade) {
    this.carriedGradeApiService
      .save(carriedGrades)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Nota u shtua me sukses!');
          this.displayModal = false;
          this.getCarriedGrades(this.filters);
        } else {
          this.toastService.showError(response.errorMessage);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të notës !'
          );
      });
  }

  updateCarriedGrade(carriedGrade: CarriedGrade) {
    this.carriedGradeApiService
      .update(carriedGrade)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Nota u ndryshua me sukses!');
          this.displayModal = false;
          this.getCarriedGrades(this.filters);
        } else {
          this.toastService.showError(response.errorMessage);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të notës!'
          );
      });
  }

  deleteCarriedGrades(carriedGrade: CarriedGrade) {
    this.carriedGradeApiService
      .delete(carriedGrade.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Nota u fshi me sukses!');
          this.getCarriedGrades(this.filters);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së notës!'
          );
      });
  }

  getExamTypeDropdown() {
    this.examTypeApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examTypeDropdown = response.data;
      });
  }

  onStudentGridEvent(event: GridEvent<SharedStudent | SharedStudent[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.setSelectedStudent(Object.assign({}, event.data as Student));
        this.showStudentModal = false;
        this.cd.detectChanges();
        break;
    }
  }

  onStudentHide() {
    this.showStudentModal = false;
  }

  getSubjectsDropdown($event: any) {
    const data = $event as {
      examTypeId: number;
      academicYearId: number;
    };
    this.examSubjectApiService
      .forExamType(
        data.examTypeId,
        data.academicYearId,
        undefined,
        undefined,
        true
      )
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSubjectsDropdown = response.data;
        this.cd.detectChanges();
      });
  }

  setSelectedStudent(student: any) {
    this.selectedStudent = student;
    this.cd.detectChanges();
  }

  getStudents($event: TableLazyLoadEvent): void {
    this.studentsApiService
      .loadStudents($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.studentList$$.next(response.data);
        this.totalStudentRecords = response.total;
        this.cd.detectChanges();
      });
  }

  getAcademicYearsDropdown(): void {
    this.academicYearApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.academicYearsDropdown = response.data;
      });
  }
}
