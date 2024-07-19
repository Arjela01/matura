import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ManualExamGradeService } from '@msh/applications/data-access-applications';
import { ExamSubjectApiService } from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {
  ExamGradeRequestModel,
  ManualExamGradeModel,
} from '@msh/shared/domain-models';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginatorModule } from 'primeng/paginator';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { BehaviorSubject } from 'rxjs';
import { ExamGradeRequestFormComponent } from '../../exam-grade-request/exam-grade-request-form/exam-grade-request-form.component';
import { ExamGradeRequestGridComponent } from '../../exam-grade-request/exam-grade-request-grid/exam-grade-request-grid.component';
import { A1a1zConfirmationDialogComponent } from '../../students/manage-students/a1a1z-confirmation-dialog/a1a1z-confirmation-dialog.component';
import { ManualExamGradeFormComponent } from '../manual-exam-grade-form/manual-exam-grade-form.component';
import { ManualExamGradeGridComponent } from '../manual-exam-grade-grid/manual-exam-grade-grid.component';

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
    RouterLink,
    TabViewModule,
    A1a1zConfirmationDialogComponent,
    CalendarModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    PaginatorModule,
    RadioButtonModule,
    InputTextareaModule,
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
  idCard: any;
  examSubjects: DropdownModel<string>[] = [];

  formSave = new EventEmitter<ExamGradeRequestModel>();
  formClose = new EventEmitter<undefined>();
  submitted = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly manualExamGradeService: ManualExamGradeService,
    private readonly examSubjectService: ExamSubjectApiService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
    this.idCard = this.route.snapshot.paramMap.get('idCard');
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedManualExamGrade = {} as ManualExamGradeModel;
  }
  examGradeRequest: ExamGradeRequestModel = {
    examGradesRequestStatusId: 0,
    examGradesRequestStatusName: '',
    idCard: '',
    dateOfBirth: '',
    firstName: '',
    id: '',
    lastName: '',
    academicYearId: 0,
    middleName: '',
    description: '',
    maturaId: '',
    email: '',
    highSchoolId: '',
    isQueued: false,
    isQueueReady: false
  };

  ngOnInit() {
    this.getExamSubject();
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.formSave.emit(this.examGradeRequest);
  }

  onModalClose() {
    this.displayModal = false;
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
          message: 'Jeni i sigurt që doni të fshini notën e zgjedhur?',
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

  getGrades(idCard: string) {
    this.manualExamGradeService.getByIdCard(idCard).subscribe(response => {
      this.manualExamGrade$$.next(response.data);
      this.totalRecords = response.total;
      this.cd.markForCheck();
    });
  }

  addGrade(manualExamGrade: ManualExamGradeModel) {
    const idCard = this.idCard;
    const valuesToSend = {
      ...manualExamGrade,
      idCard,
    };
    this.manualExamGradeService
      .save(valuesToSend)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Nota u shtua me sukses!');
          this.displayModal = false;
          this.getGrades(this.idCard);
        } else {
          this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest) {
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të notës!'
          );
        }
        this.cd.markForCheck();
      });
  }

  updateGrade(manualExamGrade: ManualExamGradeModel) {
    const idCard = this.idCard;
    const valuesToSend = {
      ...manualExamGrade,
      idCard,
    };
    this.manualExamGradeService
      .update(valuesToSend)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Nota u ndryshua me sukses!');
          this.getGrades(this.idCard);
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
          this.getGrades(this.idCard);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes të notës!'
          );
      });
  }

  getExamSubject() {
    this.examSubjectService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(res => (this.examSubjects = res.data));
  }
}
