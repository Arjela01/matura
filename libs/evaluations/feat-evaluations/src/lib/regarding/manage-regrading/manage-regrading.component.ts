import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import {
  ExamCopy,
  ExamCopyUpdate,
  ExamGradeChange,
  Regrading,
  RegradingUpdate,
  StatusEnum,
} from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  ExamGradeChangesApiService,
  RegradingApiService,
} from '@msh/evaluations/data-access-evaluations';
import { ButtonDirective } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { PrimeTemplate } from 'primeng/api';
import { Ripple } from 'primeng/ripple';
import { RegradingGridComponent } from '../regrading-grid/regrading-grid.component';
import { UploadComponent } from '../upload/upload.component';
import { ExamGradeChangesFormComponent } from '../../exam-grade-changes/exam-grade-changes-form/exam-grade-changes-form.component';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { ExamSubjectApiService } from '@msh/configurations/data-access-configurations';
import * as FileSaver from 'file-saver';
import { UpdateStatusFormComponent } from '../update-status-form/update-status-form.component';
import { ManageExamGradeChangesComponent } from '../../exam-grade-changes/manage-exam-grade-changes/manage-exam-grade-changes.component';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'msh-manage-regrading',
  standalone: true,
  imports: [
    CommonModule,
    ButtonDirective,
    ConfirmDialogModule,
    DialogModule,
    PrimeTemplate,
    Ripple,
    RegradingGridComponent,
    UploadComponent,
    ExamGradeChangesFormComponent,
    UpdateStatusFormComponent,
    ManageExamGradeChangesComponent,
  ],
  templateUrl: './manage-regrading.component.html',
  styleUrl: './manage-regrading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageRegradingComponent {
  private regrading$$ = new BehaviorSubject<Regrading[]>([]);
  regrading$ = this.regrading$$.asObservable();

  filters: TableLazyLoadEvent | null = null;
  selectedGrade: Regrading | null = null;
  totalRecords = 0;
  displayUploadModal = false;
  displayStatusModal = false;
  statuses: DropdownModel<any>[] = [];

  studentId: string | undefined;
  selectedRecord: any;
  headerText: any;
  displayHistoryForm = false;
  examSubjects: DropdownModel<string>[] = [];
  examGradeChangeTypes: DropdownModel<string>[] = [];
  displayModal = false;
  academicYearId: any;
  examGradeId: any;
  userRole = '';

  constructor(
    private readonly authFacade: AuthFacade,
    private readonly regradingApiService: RegradingApiService,
    private readonly examGradeChangeService: ExamGradeChangesApiService,
    private readonly examSubjectService: ExamSubjectApiService,
    private readonly toastService: GlobalToastService,
    private router: Router
  ) {
    const academicYear = JSON.parse(
      localStorage.getItem('academicYear') as string
    );
    if (academicYear) {
      this.academicYearId = academicYear.id;
    }
    {
      this.authFacade.token$.pipe(untilDestroyed(this)).subscribe(token => {
        if (token) {
          const decodedToken: any = jwtDecode(token);
          this.userRole =
            decodedToken[
              'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
            ];
        }
      });
    }
  }

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getGrade(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  ngOnInit() {
    this.getExamSubjects();
    this.getExamGradeChangeTypes();
    this.statuses = Object.keys(StatusEnum)
      .filter(key => !isNaN(Number(key)))
      .map(key => this.getTranslatedStatus(Number(key)));
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedGrade = {} as Regrading;
  }

  onGridEvent(event: GridEvent<any | Regrading[]>) {
    switch (event.action) {
      case GRID_ACTIONS.HISTORY:
        this.selectedRecord = Object.assign({}, event.data);
        this.studentId = event.data.id;
        this.headerText = `Historiku për Notën {${event.data.examGradeId}}`;
        this.displayHistoryForm = true;
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedGrade = Object.assign({}, event.data as Regrading);
        this.examGradeId = this.selectedGrade.examGradeId;
        this.displayModal = true;
        break;
      case GRID_ACTIONS.CUSTOM_ACTION1:
        this.selectedGrade = Object.assign({}, event.data as Regrading);
        this.displayStatusModal = true;
        break;
      case GRID_ACTIONS.CUSTOM_ACTION2:
        this.selectedGrade = Object.assign({}, event.data as Regrading);
        this.router.navigate([
          `/evaluations/exam-copy/form/${this.selectedGrade.examCopyRequestID}`,
        ]);
        break;
    }
  }

  onFormSave(examGradeChange: ExamGradeChange) {
    const valuesToSend = {
      ...examGradeChange,
      examGradeId: this.selectedGrade?.id,
    };
    if (!examGradeChange.id) {
      this.addExamGradeChange(valuesToSend);
    }
  }

  onUploadClick() {
    this.displayUploadModal = true;
  }

  onUploadClose() {
    this.displayUploadModal = false;
    this.getGrade(this.filters as TableLazyLoadEvent);
  }

  onModalClose() {
    this.displayModal = false;
  }

  onUpdateModalClose() {
    this.displayStatusModal = false;
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

  getGrade($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.regradingApiService
      .loadExamGrades($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.regrading$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  downloadTemplateFile() {
    this.regradingApiService
      .exportTemplate()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        const blob: any = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, 'Riverësim_Template');
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
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest)
          this.toastService.showError('Ndodhi një problem gjatë rivlërsimit!');
      });
  }
  getTranslatedStatus(key: number): DropdownModel<any> {
    const translations: { [key: number]: string } = {
      1: 'Kërkesë në Pritje',
      2: 'Kërkesë e Pranuar',
      3: 'Kërkesë e Refuzuar',
    };
    return { key, value: translations[key] || '' };
  }

  onStatusUpdate($event: any) {
    const valuesToSend: RegradingUpdate = {
      regradingRequestID: this.selectedGrade?.id,
      academicYearId: this.academicYearId,
      statusEnum: {
        id: $event.status,
        displayText: this.getStatusDisplayText($event.status) as any,
      },
      comments: $event.comments,
    };
    this.updateStatus(valuesToSend);
  }

  getStatusDisplayText(statusId?: number): string {
    const status = this.statuses.find(status => status.key === statusId);
    return status ? status.value : '';
  }

  updateStatus(regrading: Regrading) {
    this.regradingApiService
      .updateStatus(regrading)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Veprimi u krye me sukses');
          this.displayStatusModal = false;
          this.getGrade(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest)
          this.toastService.showError('Ndodhi një problem!');
      });
  }
}
