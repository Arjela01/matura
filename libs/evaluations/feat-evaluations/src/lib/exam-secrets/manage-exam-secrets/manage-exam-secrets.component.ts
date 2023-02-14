import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExamSecret } from '@msh/evaluations/domain-evaluations';
import {
  AcademicYearApiService,
  ExamVersionApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { RippleModule } from 'primeng/ripple';
import { ExamSecretApiService } from '@msh/evaluations/data-access-evaluations';
import { Router } from '@angular/router';
import { ExamSecretsFormComponent } from '../exam-secrets-form/exam-secrets-form.component';
import { ExamSecretsGridComponent } from '../exam-secrets-grid/exam-secrets-grid.component';
import { FileUploadModule } from 'primeng/fileupload';

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
export class ManageExamSecretsComponent {
  private examSecrets$$ = new BehaviorSubject<ExamSecret[]>([]);
  examSecrets$ = this.examSecrets$$.asObservable();
  filters: LazyLoadEvent | null = null;
  examVersions: DropdownModel<number>[] = [];
  base64: string | ArrayBuffer | null | undefined;

  totalRecords = 0;
  selectedExamSecret: ExamSecret | null = null;
  selectedExamSecrets: ExamSecret[] = [];
  displayModal = false;
  hideExamSecretForm = true;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examSecretService: ExamSecretApiService,
    private readonly academicYearApiService: AcademicYearApiService,
    private readonly router: Router,
    private readonly examVersionService: ExamVersionApiService
  ) {}

  onNewClick() {
    this.hideExamSecretForm = !this.hideExamSecretForm;
    this.router.navigate(['/evaluations/exam-secret-form']);
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
        this.router.navigate([
          'evaluations/exam-secret-form',
          this.selectedExamSecret.id,
        ]);
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

  getExamVersions() {
    this.examVersionService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examVersions = response.data;
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
          }
          if (response.isBadRequest)
            this.toastService.showError(
              'Ndodhi një problem gjatë ngarkimit të dokumentit!'
            );
        });
    };
  }
}
