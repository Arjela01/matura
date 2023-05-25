import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import {
  AdministrationOfficeApiService,
  ExamAssignmentApiService,
  ExamDateApiService,
  ExamSiteApiService,
} from '@msh/configurations/data-access-configurations';
import {AdministrationOffice, ExamAssignment} from '@msh/shared/domain-models';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';
import { BehaviorSubject } from 'rxjs';
import { ExamAssignmentGridComponent } from '../exam-assignment-grid/exam-assignment-grid.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ExamAssignmentFormComponent } from '../exam-assignment-form/exam-assignment-form.component';
import { UploadFormComponent } from '../upload-form/upload-form.component';
import * as FileSaver from 'file-saver';
import { AssignAllFormComponent } from '../assign-all-form/assign-all-form.component';

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
export class ManageExamAssignmentComponent {
  private examAssignments$$ = new BehaviorSubject<ExamAssignment[]>([]);
  examAssignments$ = this.examAssignments$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedExamAssignment: ExamAssignment | null = null;
  selectedExamAssignments: ExamAssignment[] = [];
  displayModal = false;
  displayUploadModal = false;
  displayAssignAllModal = false;

  examDates: DropdownModel<number>[] = [];
  examSites: DropdownModel<number>[] = [];
  administrationOffices: any;
  time: any;
  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examAssignmentService: ExamAssignmentApiService,
    private readonly examDateService: ExamDateApiService,
    private readonly examSiteService: ExamSiteApiService,
    private readonly administrationOfficeService: AdministrationOfficeApiService
  ) {}

  onGridEvent(event: GridEvent<ExamAssignment | ExamAssignment[]>) {
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

  onUploadClose() {
    this.displayUploadModal = false;
    this.getExamAssignments(this.filters as LazyLoadEvent);
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedExamAssignment = {} as ExamAssignment;
  }

  onModalClose() {
    this.displayModal = false;
  }
  onAssignAllModalClose(){
    this.displayAssignAllModal = false;
  }
  onAssignAllClick(){
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
    this.getExamAssignments(this.filters as LazyLoadEvent);
  }

  getExamAssignments($event: LazyLoadEvent) {
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
          this.getExamAssignments(this.filters as LazyLoadEvent);
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
          this.getExamAssignments(this.filters as LazyLoadEvent);
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
          this.getExamAssignments(this.filters as LazyLoadEvent);
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
  getExamSiteDropdown() {
    this.examSiteService.loadDropdownList().subscribe(response => {
      this.examSites = response.data;
    });
  }
  getAdministrationOfficeDropdown() {
    this.administrationOfficeService
      .loadDropdownList()
      .subscribe(res => (this.administrationOffices = res.data));
  }
}
