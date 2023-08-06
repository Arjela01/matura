import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ExamSecret } from '@msh/shared/domain-models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExamSecretApiService } from '@msh/evaluations/data-access-evaluations';

@UntilDestroy()
@Component({
  selector: 'msh-exam-secrets-folder-mismatch',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    ColumnFilterDirective,
  ],
  templateUrl: './exam-secret-folder-mismatch.component.html',
  styleUrls: ['./exam-secret-folder-mismatch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSecretFolderMismatchComponent {
  examSecrets: ExamSecret[] = [];
  totalRecords = 0;
  loading = false;

  constructor(
    private examSecretApiService: ExamSecretApiService,
    private cd: ChangeDetectorRef
  ) {}

  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamSecret | ExamSecret[]>
  >();

  onEditClick(examSecret: ExamSecret) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examSecret,
    } as GridEvent<ExamSecret>);
  }

  onDeleteClick(examSecret: ExamSecret) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examSecret,
    } as GridEvent<ExamSecret>);
  }

  loadRows($event: LazyLoadEvent) {
    this.examSecretApiService
      .loadExamSecretFolderMismatch($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSecrets = response.data;
        this.totalRecords = response.total;
        this.cd.detectChanges();
      });
  }
}
