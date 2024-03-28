import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  AdministrationOfficeApiService,
  ExamAssignmentApiService,
  ExamDateApiService,
  ExamSiteApiService,
  ProfileApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ExamAssignment } from '@msh/shared/domain-models';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as FileSaver from 'file-saver';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TableLazyLoadEvent } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { AssignAllFormComponent } from '../assign-all-form/assign-all-form.component';
import { ExamAssignmentFormComponent } from '../exam-assignment-form/exam-assignment-form.component';
import { ExamAssignmentGridComponent } from '../exam-assignment-grid/exam-assignment-grid.component';
import { UploadFormComponent } from '../upload-form/upload-form.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-assignment',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ExamAssignmentGridComponent,
    ExamAssignmentFormComponent,
    ToolbarModule,
    FileUploadModule,
    UploadFormComponent,
    AssignAllFormComponent,
  ],
  templateUrl: './manage-exam-assignment.component.html',
  styleUrls: ['./manage-exam-assignment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamAssignmentComponent implements OnInit {
  private examAssignments$$ = new BehaviorSubject<ExamAssignment[]>([]);
  examAssignments$ = this.examAssignments$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  totalRecords = 0;
  examAssignment: ExamAssignment | null = null;
  selectedExamAssignment: ExamAssignment | null = null;
  selectedExamAssignments: ExamAssignment[] = [];
  displayModal = false;
  displayUploadModal = false;
  displayAssignAllModal = false;
  schoolProfileId: DropdownModel<any>[] = [];
  examDatesForAssignAll: DropdownModel<number>[] = [];
  examDates: DropdownModel<number>[] = [];
  examSites: DropdownModel<string>[] = [];
  examSiteForAdministrationOffice: DropdownModel<string>[] = [];
  administrationOffices: any;
  headerText!: string;
  studentId: number | undefined;
  selectedRecord: ExamAssignment | null = null;
  displayHistoryForm = false;
  examAssignmentId!: string;
  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examAssignmentService: ExamAssignmentApiService,
    private readonly examDateService: ExamDateApiService,
    private readonly examSiteService: ExamSiteApiService,
    private readonly cd: ChangeDetectorRef,
    private readonly administrationOfficeService: AdministrationOfficeApiService,
    private readonly profileService: ProfileApiService
  ) {}

  onGridEvent(event: GridEvent<any | ExamAssignment[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedExamAssignments = [
          ...this.selectedExamAssignments,
          event.data as ExamAssignment,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedExamAssignments = this.selectedExamAssignments.filter(
          ea => {
            const examAssignment: ExamAssignment = event.data as ExamAssignment;
            return ea.id !== examAssignment.id;
          }
        );
        break;
      case GRID_ACTIONS.HISTORY:
        this.displayHistoryForm = true;
        this.selectedRecord = Object.assign({}, event.data);
        this.examAssignmentId = event.data.id;
        this.headerText = `Historiku për Caktim në Qendër Provimi {${event.data.id}}`;
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedExamAssignments = [
          ...this.selectedExamAssignments,
          ...(event.data as ExamAssignment[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedExamAssignments = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedExamAssignment = Object.assign(
          {},
          event.data as ExamAssignment
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurt që doni të fshini caktimin në qendrën e provimit të zgjedhur?',
          accept: () => {
            this.deleteExamAssignment(event.data as ExamAssignment);
          },
        });
        break;
    }
  }
  onUploadClick() {
    this.displayUploadModal = true;
  }
  ngOnInit(): void {
    this.getAdministrationOfficeDropdown();
    this.getSchoolProfiles();
  }

  onUploadClose() {
    this.displayUploadModal = false;
    this.getExamAssignments(this.filters as TableLazyLoadEvent);
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedExamAssignment = {} as ExamAssignment;
  }

  onModalClose() {
    this.displayModal = false;
  }
  onAssignAllModalClose() {
    this.displayAssignAllModal = false;
  }
  onAssignAllClick() {
    this.displayAssignAllModal = true;
  }

  onFormSave(examAssignment: ExamAssignment) {
    if (examAssignment.id) {
      this.updateExamAssignment(examAssignment);
    }
    if (!examAssignment.id) {
      this.addExamAssignment(examAssignment);
    }
  }
  onUploadFormSave() {
    this.getExamAssignments(this.filters as TableLazyLoadEvent);
  }
  onAdministrationOfficeChanged(administrationOfficeId: number) {
    this.getExamSite(administrationOfficeId);
  }

  onExamSiteChanged(examSiteId: string[]) {
    this.getExamDatesForAssignAll(examSiteId);
  }
  onExamDateChanged(examDateId: any) {
    if (this.examAssignment != null) {
      this.examAssignment.examDateId = examDateId;
    }
  }

  getExamSite(administrationOfficeId: any) {
    const academicYearString = localStorage.getItem('academicYear');
    if (academicYearString) {
      const academicYear = JSON.parse(academicYearString);
      const academicYearId = academicYear.id;
      this.examSiteService
        .forAdministrationOffice(administrationOfficeId, academicYearId)
        .pipe(untilDestroyed(this))
        .subscribe(res => (this.examSiteForAdministrationOffice = res.data));
      this.cd.detectChanges();
    }
  }

  getExamAssignments($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examAssignmentService
      .loadExamAssignments($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        response.data.map(examAssignment => {
          if (examAssignment?.examTypeDateTime)
            return (examAssignment.time =
              examAssignment.examTypeDateTime.split(' ')[2]);

          return examAssignment;
        });
        this.examAssignments$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addExamAssignment(examAssignment: ExamAssignment) {
    this.examAssignmentService
      .save(examAssignment)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Caktimi në qendër provimi u shtua me sukses!'
          );
          this.displayModal = false;
          this.getExamAssignments(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë shtimit të caktimit në qendër të provimit!'
          );
      });
  }

  updateExamAssignment(examAssignment: ExamAssignment) {
    this.examAssignmentService
      .update(examAssignment)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Caktimi në qender provimi u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getExamSiteDropdown();
          this.getExamDateDropdown();
          this.getExamAssignments(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të caktimit në qendër të provimit!'
          );
      });
  }

  deleteExamAssignment(examAssignment: ExamAssignment) {
    this.examAssignmentService
      .delete(examAssignment.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo(
            'Caktimi në qendrën e provimit u fshi me sukses!'
          );
          this.getExamAssignments(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes të caktimit në qendrën e provimit!'
          );
      });
  }
  downloadFile() {
    this.examAssignmentService
      .export()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        const blob: any = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, 'Lista_Emërore ');
      });
  }
  getExamDateDropdown() {
    this.examDateService.loadDropdownList().subscribe(response => {
      this.examDates = response.data;
    });
  }
  getExamDatesForAssignAll(examSiteId: string[]) {
    this.examDateService.forExamSiteIds(examSiteId).subscribe(response => {
      this.examDatesForAssignAll = response.data;
    });
  }
  getExamSiteDropdown() {
    this.examSiteService.loadDropdownList().subscribe(response => {
      this.examSites = response.data;
    });
  }
  getAdministrationOfficeDropdown() {
    this.administrationOfficeService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.administrationOffices = response.data;
        this.cd.markForCheck();
      });
  }
  getSchoolProfiles() {
    this.profileService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.schoolProfileId = response.data;
      });
  }
  onAssignAllFormSave(examAssignment: any) {
    Object.keys(examAssignment).forEach(key => {
      if (
        examAssignment[key] === null ||
        examAssignment[key] === 0 ||
        examAssignment[key] === ''
      )
        delete examAssignment[key];
    });

    const filteredAssignment = { ...examAssignment };

    filteredAssignment.examSiteIds = examAssignment.examSiteId;
    filteredAssignment.examDateIds = examAssignment.examDateId;
    delete filteredAssignment.examSiteId;
    delete filteredAssignment.examDateId;

    this.assignAll(filteredAssignment);
  }
  assignAll(examAssignment: any) {
    this.examAssignmentService
      .examAssign(examAssignment)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examAssignment = response.data;
        if (response.isSuccessful) {
          this.toastService.showSuccess(response.data.toString());
          this.displayAssignAllModal = false;
          this.getExamAssignments(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest) {
          this.toastService.showError(
            'Ndodhi një problem gjatë caktimit të studentëve në qendra.'
          );
        }
      });
  }
}
