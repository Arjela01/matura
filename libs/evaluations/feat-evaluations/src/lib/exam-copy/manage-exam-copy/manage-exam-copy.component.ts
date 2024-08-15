import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { ExamCopyApiService } from '@msh/evaluations/data-access-evaluations';
import { AcademicYear, ExamCopy } from '@msh/shared/domain-models';
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
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  skip,
  tap,
} from 'rxjs';
import { ExamCopyDetailsComponent } from '../exam-copy-details/exam-copy-details.component';
import { ExamCopyGridComponent } from '../exam-copy-grid/exam-copy-grid.component';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { ExamSecretsFormComponent } from '../../exam-secrets/exam-secrets-form/exam-secrets-form.component';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpEventType } from '@angular/common/http';
import { CustomSwitchComponent } from '@msh/layout/feat-layout';

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
    CustomSwitchComponent,
  ],
})
export class ManageExamCopyComponent {
  private examCopies$$ = new BehaviorSubject<ExamCopy[]>([]);
  examCopies$ = this.examCopies$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  selecetdExamCopy: ExamCopy | null = null;
  examCopyId: string | undefined;
  selectedRecord: any;
  headerText: any;
  displayHistoryForm = false;
  totalRecords = 0;
  displayModal = false;
  isOn = false;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly examCopyService: ExamCopyApiService,
    private readonly toastService: GlobalToastService,
    private readonly authFacade: AuthFacade
  ) {}

  changes$ = combineLatest([
    this.authFacade.academicYear$.pipe(skip(1)),
    this.authFacade.isFall$.pipe(
      tap(isFall => {
        this.isOn = isFall;
      })
    ),
  ])
    .pipe(
      distinctUntilChanged(),
      skip(1),
      untilDestroyed(this),
      tap(() => {
        if (this.filters) {
          this.getExamCopies(this.filters as TableLazyLoadEvent);
        }
      })
    )
    .subscribe();

  onGridEvent(event: GridEvent<any | ExamCopy[]>) {
    switch (event.action) {
      case GRID_ACTIONS.HISTORY:
        this.selectedRecord = Object.assign({}, event.data);
        this.examCopyId = event.data.id;
        this.headerText = `Historiku për Kopjen {${event.data.id}}`;
        this.displayHistoryForm = true;
        break;
    }
  }

  onSwitchChange(event: any) {
    this.isOn = event;
    this.getExamCopies(this.filters as TableLazyLoadEvent);
  }

  onModalClose() {
    this.displayModal = false;
    this.selecetdExamCopy = null;
  }

  getExamCopies($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    if (this.isOn) {
      this.filters.filters = {
        ...this.filters.filters,
        isFall: {
          value: this.isOn,
          matchMode: 'equals',
        },
      };
    } else {
      const { isFall, ...restFilters } = this.filters.filters || {};
      this.filters.filters = restFilters;
    }

    this.examCopyService
      .loadExamCopies(this.filters)
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
      .exportTemplate(this.isOn)
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
  uploadProgress = 0;

  uploadFile($event: MouseEvent) {
    console.log(this.file);
    if (this.file) {
      this.examCopyService.uploadFile(this.file).subscribe({
        next: event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(
              (100 * event.loaded) / event.total!
            );
            this.cd.markForCheck();
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
