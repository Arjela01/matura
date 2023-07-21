import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade } from '@msh/auth/data-access-auth';
import {ExamSubjectApiService, ExamTypeApiService} from '@msh/configurations/data-access-configurations';
import { ExamSecretApiService } from '@msh/evaluations/data-access-evaluations';
import { ExamSecret } from '@msh/evaluations/domain-evaluations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as FileSaver from 'file-saver';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { ExamSecretsFormComponent } from '../exam-secrets-form/exam-secrets-form.component';
import { ExamSecretsGridComponent } from '../exam-secrets-grid/exam-secrets-grid.component';

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
  ],
  templateUrl: './manage-exam-secrets.component.html',
  styleUrls: ['./manage-exam-secrets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamSecretsComponent implements OnInit {
  private examSecrets$$ = new BehaviorSubject<ExamSecret[]>([]);
  examSecrets$ = this.examSecrets$$.asObservable();
  filters: LazyLoadEvent | null = null;
  base64: string | ArrayBuffer | null | undefined;
  totalRecords = 0;
  selectedExamSecret: ExamSecret | null = null;
  selectedExamSecrets: ExamSecret[] = [];
  displayModal = false;
  examSubjects: DropdownModel<string>[] = [];
  examTypes: DropdownModel<number>[] = [];

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    map(([_]) => {
      if (this.filters) {
        this.getExamSecrets(this.filters as LazyLoadEvent);
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
    private authFacade: AuthFacade,
    private readonly cd: ChangeDetectorRef,

  ) {}

  ngOnInit(): void {
    this.getExamTypes();
    this.getExamSubjects();
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedExamSecret = {} as ExamSecret;
  }

  onGridEvent(event: GridEvent<ExamSecret | ExamSecret[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedExamSecrets = [
          ...this.selectedExamSecrets,
          event.data as ExamSecret,
        ];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedExamSecret = Object.assign({}, event.data as ExamSecret);
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
    this.cd.detectChanges();
  }

  getExamSubjects(examTypeId?: number) {
    this.examSubjectService
      .forExamType(examTypeId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSubjects = response.data;
        this.cd.markForCheck();
      });
  }
  getExamTypes() {
    this.examTypeService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examTypes = response.data;
      });
  }

  getExamSecrets($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examSecretService
      .loadExamSecrets($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSecrets$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  deleteExamSecret(examSecret: ExamSecret) {
    this.examSecretService
      .delete(examSecret.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Sekretimi u fshi me sukses!');
          this.getExamSecrets(this.filters as LazyLoadEvent);
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
            this.getExamSecrets(this.filters as LazyLoadEvent);
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
  downloadFile() {
    this.examSecretService
      .export()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        const blob: any = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, 'Nota_Pikë');
      });
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
    if (examSecret.id) {
      this.updateExamSecret(examSecret);
    }
    if (!examSecret.id) {
      this.addExamSecret(examSecret);
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
          this.getExamSecrets(this.filters as LazyLoadEvent);
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
          this.getExamSecrets(this.filters as LazyLoadEvent);
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

  onExamTypeChanged(examTypeId: any) {
    if (this.selectedExamSecret != null)
      this.selectedExamSecret.examTypeId = examTypeId;
    this.getExamSubjects(examTypeId);
  }
}
