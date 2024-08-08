import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Student, StudentBan } from '@msh/shared/domain-models';
import {
  GridEvent,
  GRID_ACTIONS,
  ColumnFilterDirective,
  DateFilterService,
} from '@msh/shared/util-shared';
import {
  TableLazyLoadEvent,
  TableRowSelectEvent,
  TableRowUnSelectEvent,
} from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { AppBoolPipe, AppDatePipe } from '@msh/shared/ui-shared';
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { StudentBanHistoryComponent } from '../student-ban-history/student-ban-history.component';

@Component({
  selector: 'msh-student-ban-grid',
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
    DialogModule,
    StudentBanHistoryComponent,
  ],
  templateUrl: './student-ban-grid.component.html',
  styleUrls: ['./student-ban-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class StudentBanGridComponent {
  @Input() bannedStudents: StudentBan[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() studentId: any;
  @Input() headerText = '';
  @Input() displayHistoryForm = true;
  @Input() selectedRecord: any;

  //Keep it local state because of Table Header checkbox not syncing
  selectedBannedStudents: StudentBan[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<StudentBan | StudentBan[]>
  >();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();
  constructor(private dateFilterService: DateFilterService) {}

  onEditClick(studentBan: StudentBan) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: studentBan,
    } as GridEvent<StudentBan>);
  }

  onDeleteClick(StudentBan: StudentBan) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: StudentBan,
    } as GridEvent<StudentBan>);
  }

  onHistoryClick(student: StudentBan) {
    this.displayHistoryForm = true;
    this.gridEvent.emit({
      action: GRID_ACTIONS.HISTORY,
      data: student,
    } as GridEvent<StudentBan>);
  }

  loadRows($event: TableLazyLoadEvent) {
    const filters = $event.filters as any;
    $event.filters = this.dateFilterService.applyDateManipulation(filters);
    this.lazyLoadData.emit($event);
  }
}
