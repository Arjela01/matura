import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade } from '@msh/auth/data-access-auth';
import {
  AdministrationOfficeApiService,
  ExamDateApiService,
  ExamSiteApiService,
  ExamSubjectApiService,
  ExamTypeApiService,
} from '@msh/configurations/data-access-configurations';
import { ExamSecretApiService } from '@msh/evaluations/data-access-evaluations';
import { DropdownModel } from '@msh/shared/data-access-shared';
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
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { ExamSecretsFormComponent } from '../exam-secrets-form/exam-secrets-form.component';
import { ExamSecretsGridComponent } from '../exam-secrets-grid/exam-secrets-grid.component';
import { ExamSecret } from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';
import { ArchiveFolderGridComponent } from '../../archive-folder/archive-folder-grid/archive-folder-grid.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-connect-exam-secrets',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ExamSecretsFormComponent,
    ExamSecretsGridComponent,
    ToolbarModule,
    RippleModule,
    FileUploadModule,
    ArchiveFolderGridComponent,
  ],
  templateUrl: './manage-exam-secrets.component.html',
  styleUrls: ['./manage-exam-secrets.component.scss'],
  providers: [ConfirmationService],
})
export class ManageExamSecretsComponent implements OnInit {
  private examSecrets$$ = new BehaviorSubject<ExamSecret[]>([]);
  examSecrets$ = this.examSecrets$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  base64: string | ArrayBuffer | null | undefined;
  totalRecords = 0;
  selectedExamSecret: ExamSecret | null = null;
  displayModal = false;
  examSubjects: DropdownModel<string>[] = [];
  examTypes: DropdownModel<number>[] = [];
  administrationOffices: DropdownModel<number>[] = [];
  examSites: DropdownModel<string>[] = [];
  examSecretNotes: DropdownModel<string>[] = [];
  examDates: DropdownModel<number>[] = [];

  examSecretId: string | undefined;
  selectedRecord: any;
  headerText: any;
  displayHistoryForm = false;

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    map(([_]) => {
      if (this.filters) {
        this.getExamSecrets(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );
  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examSecretService: ExamSecretApiService,
    private readonly router: Router,
    private readonly examSubjectService: ExamSubjectApiService,
    private readonly examTypeService: ExamTypeApiService,
    private readonly administrationOfficesService: AdministrationOfficeApiService,
    private readonly examSiteService: ExamSiteApiService,
    private readonly examDateService: ExamDateApiService,
    private authFacade: AuthFacade,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAdministrationOffices();
    this.getExamSecretNotes();
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedExamSecret = {} as ExamSecret;
  }

  onGridEvent(event: GridEvent<any | ExamSecret[]>) {
    switch (event.action) {
      case GRID_ACTIONS.HISTORY:
        this.selectedRecord = Object.assign({}, event.data);
        this.examSecretId = event.data.id;
        this.headerText = `Historiku për Pikët e Sekretimit {${event.data.id}}`;
        this.displayHistoryForm = true;
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedExamSecret = Object.assign({}, event.data as ExamSecret);
        this.getEXamSites(
          this.selectedExamSecret.administrationOfficeId as number
        );
        this.getExamTypes(this.selectedExamSecret.examSiteId);
        this.getExamSubjects(this.selectedExamSecret.examTypeId);
        this.getExamDates(
          this.selectedExamSecret.examSiteId as string,
          this.selectedExamSecret.examTypeId as number
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini sekretimin e zgjedhur?',
          accept: () => {
            this.deleteExamSecret(event.data as ExamSecret);
          },
        });
        break;
    }
  }

  onExamSiteChanged(examSiteId: any) {
    if (this.selectedExamSecret != null) {
      this.selectedExamSecret.examSiteId = examSiteId;
    }
    this.getExamTypes(examSiteId);
  }

  onExamTypeChanged($event: any) {
    if (this.selectedExamSecret != null) {
      this.selectedExamSecret.examTypeId = $event.examTypeId;
      this.selectedExamSecret.examSiteId = $event.examSiteId;
    }
    this.getExamSubjects($event.examTypeId);
    this.getExamDates($event.examSiteId, $event.examTypeId);
  }

  onAdmOfficeChange(administrationOfficeId: any) {
    if (this.selectedExamSecret != null)
      this.selectedExamSecret.administrationOfficeId = administrationOfficeId;
    this.getEXamSites(administrationOfficeId);
  }

  getExamSubjects(examTypeId: any) {
    this.examSubjectService
      .forExamType(examTypeId, undefined, undefined, undefined, true)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSubjects = response.data;
      });
  }

  getExamTypes(examSiteId: any) {
    this.examTypeService
      .getExamTypesForSiteId(examSiteId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examTypes = response.data;
      });
  }

  getAdministrationOffices() {
    this.administrationOfficesService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.administrationOffices = response.data;
      });
  }

  getEXamSites(administrationOfficeId: number) {
    this.examSiteService
      .forAdministrationOffice(administrationOfficeId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSites = response.data;
      });
  }

  getExamDates(examSiteId: string, examTypeId: number) {
    this.examDateService
      .forExamSiteAndExamType(examSiteId, examTypeId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examDates = response.data;
      });
  }

  getExamSecretNotes() {
    this.examTypeService
      .loadDropdownExamNotesList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSecretNotes = response.data;
      });
  }

  getExamSecrets($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examSecretService
      .loadExamSecrets($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSecrets$$.next(response.data);
        this.totalRecords = response.total;
        this.cd.detectChanges();
      });
  }

  deleteExamSecret(examSecret: ExamSecret) {
    this.examSecretService
      .delete(examSecret.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Sekretimi u fshi me sukses!');
          this.getExamSecrets(this.filters as TableLazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së sekretimit!'
          );
      });
  }

  onUpload(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      this.base64 = base64.split(',')[1];
      this.examSecretService
        .uploadExcelFile(this.base64)
        .subscribe(response => {
          if (response.isSuccessful) {
            this.toastService.showSuccess('Dokumenti u shtua me sukses!');
            this.getExamSecrets(this.filters as TableLazyLoadEvent);
          }
          if (response.isBadRequest)
            this.toastService.showError(
              'Ndodhi një problem gjatë ngarkimit të dokumentit!'
            );
          if (!response.isSuccessful) {
            this.toastService.showError(response.errorMessage);
          }
        });
    };
  }

  downloadTemplateFile() {
    this.examSecretService
      .exportTemplate()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        const blob: any = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, 'Sekretimi_Template');
      });
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(examSecret: ExamSecret) {
    const valuesToSend: ExamSecret = {
      id: examSecret.id,
      studentId: examSecret.studentId,
      examTypeId: examSecret.examTypeId,
      examSubjectId: examSecret.examSubjectId,
      examSecretNoteId: examSecret.examSecretNoteId,
      barcode: examSecret.barcode,
      isFall: examSecret.isFall,
    };
    if (examSecret.id) {
      this.updateExamSecret(valuesToSend);
    }
    if (!examSecret.id) {
      this.addExamSecret(valuesToSend);
    }
  }

  addExamSecret(examSecret: ExamSecret) {
    this.examSecretService
      .save(examSecret)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Sekretimi u shtua me sukses!');
          this.displayModal = false;
          this.getExamSecrets(this.filters as TableLazyLoadEvent);
        } else {
          this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest) {
          this.toastService.showError(
            'Ndodhi një problem gjatë shtimit të sekretimit!'
          );
        }
      });
  }

  updateExamSecret(examSecret: ExamSecret) {
    this.examSecretService
      .update(examSecret)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Sekretimi u ndryshua me sukses!');
          this.displayModal = false;
          this.getExamSecrets(this.filters as TableLazyLoadEvent);
        } else {
          this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest) {
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të sekretimit!'
          );
        }
      });
  }
}
