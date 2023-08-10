import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ExamCopyApiService } from '@msh/evaluations/data-access-evaluations';
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
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { ExamCopyDetailsComponent } from '../exam-copy-details/exam-copy-details.component';
import { ExamCopyGridComponent } from '../exam-copy-grid/exam-copy-grid.component';
import * as FileSaver from 'file-saver';
import { ExamCopy } from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';

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
  ],
})
export class ManageExamCopyComponent implements OnInit {
  private examCopies$$ = new BehaviorSubject<ExamCopy[]>([]);
  examCopies$ = this.examCopies$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  selecetdExamCopy: ExamCopy | null = null;

  totalRecords = 0;
  displayModal = false;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly examCopyService: ExamCopyApiService,
    private readonly toastService: GlobalToastService
  ) {}

  ngOnInit(): void {
    console.log('init');
  }

  onGridEvent(event: GridEvent<ExamCopy | ExamCopy[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.selecetdExamCopy = Object.assign({}, event.data as ExamCopy);
        this.displayModal = true;
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
    this.selecetdExamCopy = null;
  }

  onFormSave(examCopy: ExamCopy) {
    console.log(examCopy);
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
}
