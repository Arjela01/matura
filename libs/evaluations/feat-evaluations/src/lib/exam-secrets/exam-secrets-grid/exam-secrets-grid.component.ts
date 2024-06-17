import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
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
import { TableLazyLoadEvent } from 'primeng/table';
import { ArchiveFolder, ExamSecret, Student } from '@msh/shared/domain-models';
import { DialogModule } from 'primeng/dialog';
import { ExamSecretHistoryGridComponent } from '../exam-secret-history/exam-secret-history-grid.component';
import {AppDatePipe} from "@msh/shared/ui-shared";

@Component({
  selector: 'msh-exam-secret-grid',
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
    DialogModule,
    ExamSecretHistoryGridComponent,
    AppDatePipe,
  ],
  templateUrl: './exam-secrets-grid.component.html',
  styleUrls: ['./exam-secrets-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSecretsGridComponent {
  @Input() examSecrets: ExamSecret[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  @Input() examSecretId: any;
  @Input() headerText = '';
  @Input() displayHistoryForm = true;
  @Input() selectedRecord: any;

  //Keep it local state because of Table Header checkbox not syncing
  selectedExamSecrets: ExamSecret[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamSecret | ExamSecret[]>
  >();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onEditClick(examScore: ExamSecret) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examScore,
    } as GridEvent<ExamSecret>);
  }

  onDeleteClick(examScore: ExamSecret) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examScore,
    } as GridEvent<ExamSecret>);
  }
  onHistoryClick(archiveFolder: ArchiveFolder) {
    this.displayHistoryForm = true;
    this.gridEvent.emit({
      action: GRID_ACTIONS.HISTORY,
      data: archiveFolder,
    } as GridEvent<Student>);
  }

  onSelectAllClick() {
    if (this.selectedExamSecrets.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<ExamSecret>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedExamSecrets,
      } as GridEvent<ExamSecret[]>);
    }
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
