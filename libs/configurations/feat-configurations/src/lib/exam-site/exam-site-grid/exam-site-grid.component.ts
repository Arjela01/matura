import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ExamSite, Student } from '@msh/shared/domain-models';
import { AppBoolPipe } from '@msh/shared/ui-shared';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import {
  TableLazyLoadEvent,
  TableModule,
  TableRowSelectEvent,
  TableRowUnSelectEvent,
} from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { EXAM_SITE } from '@msh/audit-logs/feat-audit-log';
import { ExamSiteHistoryGridComponent } from '../exam-site-history/exam-site-history-grid.component';

@Component({
  selector: 'msh-exam-site-grid',
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
    AppBoolPipe,
    DialogModule,
    ExamSiteHistoryGridComponent,
  ],
  templateUrl: './exam-site-grid.component.html',
  styleUrls: ['./exam-site-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSiteGridComponent {
  @Input() examSites: ExamSite[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() id: any;
  @Input() headerText = '';
  @Input() displayHistoryForm = true;
  @Input() selectedRecord: any;

  //Keep it local state because of Table Header checkbox not syncing
  selectedExamSites: ExamSite[] = [];

  @Output() gridEvent = new EventEmitter<GridEvent<ExamSite | ExamSite[]>>();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onEditClick(examSite: ExamSite) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examSite,
    } as GridEvent<ExamSite>);
  }

  onDeleteClick(examSite: ExamSite) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examSite,
    } as GridEvent<ExamSite>);
  }

  onHistoryClick(examSite: ExamSite) {
    this.displayHistoryForm = true;
    this.gridEvent.emit({
      action: GRID_ACTIONS.HISTORY,
      data: examSite,
    } as GridEvent<ExamSite>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
