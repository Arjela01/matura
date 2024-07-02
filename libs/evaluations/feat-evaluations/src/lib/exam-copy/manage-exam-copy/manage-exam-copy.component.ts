import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { ExamCopyApiService } from '@msh/evaluations/data-access-evaluations';
import { ExamCopy } from '@msh/shared/domain-models';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
  API_URL,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as FileSaver from 'file-saver';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import { ExamCopyDetailsComponent } from '../exam-copy-details/exam-copy-details.component';
import { ExamCopyGridComponent } from '../exam-copy-grid/exam-copy-grid.component';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { ExamSecretsFormComponent } from '../../exam-secrets/exam-secrets-form/exam-secrets-form.component';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { HttpResponse } from '@microsoft/signalr';
import { HttpEventType } from '@angular/common/http';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-copy',
  standalone: true,
  templateUrl: './manage-exam-copy.component.html',
  styleUrls: ['./manage-exam-copy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
  imports: [
    CommonModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    ToolbarModule,
    RippleModule,
    ConfirmDialogModule,
    ExamCopyGridComponent,
    ExamCopyDetailsComponent,
    ExamSecretsFormComponent,
    FileUploadModule,
  ],
})
export class ManageExamCopyComponent {
  private examCopies$$ = new BehaviorSubject<ExamCopy[]>([]);
  examCopies$ = this.examCopies$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  selecetdExamCopy: ExamCopy | null = null;

  totalRecords = 0;
  displayModal = false;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly examCopyService: ExamCopyApiService,
    private readonly toastService: GlobalToastService,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getExamCopies(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  onModalClose() {
    this.displayModal = false;
    this.selecetdExamCopy = null;
  }

  getExamCopies($event: any) {
    this.filters = Object.assign({}, $event);
    this.examCopyService
      .loadExamCopies($event)
      .pipe(untilDestroyed(this))
      .subscribe(
        response => {
          this.examCopies$$.next(response.data);
          this.totalRecords = response.total;
        },
        error => {
          this.toastService.showError(error);
        }
      );
  }

  downloadTemplateFile() {
    this.examCopyService
      .exportTemplate()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        const blob: any = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, 'AplikimKopjeTesti_Template');
      });
  }

  showUploadDialog() {
    this.displayModal = true;
  }

  file: any = null;

  uploadFile($event: MouseEvent) {
    console.log(this.file);
    if (this.file) {
      this.examCopyService.uploadFile(this.file).subscribe({
        next: event => {
          if (event.type === HttpEventType.UploadProgress) {
            console.log(
              'Upload progress:',
              Math.round((100 * event.loaded) / event.total!)
            );
          } else if (event.type == HttpEventType.Response) {
            if (event.body.isSuccessful) {
              this.toastService.showSuccess('Ngarkim i suksesshëm');
              this.displayModal = false;
              if (this.filters) {
                this.getExamCopies(this.filters as TableLazyLoadEvent);
              }
            } else {
              this.toastService.showError(
                'Ngarkim me gabime: ' + event.body.errorMessage
              );
            }
          }
        },
        error: error => {
          this.toastService.showError('Gabim në ngarkim ' + error);
        },
      });
    }
  }

  onUpload($event: any) {
    if ($event.files.length > 0) {
      this.file = $event.files[0];
    } else {
      this.file = null;
    }
  }
}
