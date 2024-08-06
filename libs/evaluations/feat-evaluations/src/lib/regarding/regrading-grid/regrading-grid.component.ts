import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  ExamCopyRequestStatusEnum,
  Regrading,
  Student,
  StudentBan,
} from '@msh/shared/domain-models';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { AppBoolPipe, AppDatePipe } from '@msh/shared/ui-shared';
import { RouterLink } from '@angular/router';
import { RoleName } from '@msh/configurations/feat-configurations';
import { ExamCopyRequestStatusPipe } from '../../exam-copy/exam-copy-grid/exam-copy-request-status-pipe';
import { DialogModule } from 'primeng/dialog';
import { RegradingHistoryGridComponent } from '../regrading-history/regrading-history-grid.component';

@Component({
  selector: 'msh-regrading-grid',
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
    DatePipe,
    AppDatePipe,
    AppBoolPipe,
    RouterLink,
    ExamCopyRequestStatusPipe,
    DialogModule,
    RegradingHistoryGridComponent,
  ],
  templateUrl: './regrading-grid.component.html',
  styleUrl: './regrading-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegradingGridComponent {
  @Input() regrading: Regrading[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() userRole = '';
  @Input() studentId: any;
  @Input() headerText = '';
  @Input() displayHistoryForm = true;
  @Input() selectedRecord: any;

  @Output() gridEvent = new EventEmitter<GridEvent<Regrading | Regrading[]>>();
  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }

  onEditClick(grade: Regrading) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: grade,
    } as GridEvent<Regrading>);
  }

  onHistoryClick(grade: Regrading) {
    this.displayHistoryForm = true;
    this.gridEvent.emit({
      action: GRID_ACTIONS.HISTORY,
      data: grade,
    } as GridEvent<Regrading>);
  }

  onUpdateStatus(grade: Regrading) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.CUSTOM_ACTION1,
      data: grade,
    } as GridEvent<Regrading>);
  }

  protected readonly ExamCopyRequestStatusEnum = ExamCopyRequestStatusEnum;
  protected readonly RoleName = RoleName;
}
