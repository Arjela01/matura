import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AppBoolPipe, AppDatePipe } from '@msh/shared/ui-shared';
import { DiplomaRequest, Student } from '@msh/shared/domain-models';
import {
  ColumnFilterDirective,
  DateFilterService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { STUDENTS } from '../../students/students-query';
import { DiplomaRequestHistoryComponent } from '../diploma-request-history/diploma-request-history.component';

@Component({
  selector: 'msh-diploma-request-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    RouterLink,
    ColumnFilterDirective,
    DatePipe,
    AppDatePipe,
    AppBoolPipe,
    DialogModule,
    DiplomaRequestHistoryComponent,
  ],
  templateUrl: './diploma-request-grid.component.html',
  styleUrl: './diploma-request-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiplomaRequestGridComponent {
  @Input() diplomas: DiplomaRequest[] = [];
  @Input() totalRecords = 0;
  @Input() id: any;
  @Input() headerText = '';
  @Input() displayHistoryForm = true;
  @Input() selectedRecord: any;
  @Output() gridEvent = new EventEmitter<GridEvent<DiplomaRequest>>();
  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  constructor(private dateFilterService: DateFilterService) {}

  onEdit(data: DiplomaRequest) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: data,
    } as GridEvent<DiplomaRequest>);
  }

  onHistoryClick(data: DiplomaRequest) {
    this.displayHistoryForm = true;
    this.gridEvent.emit({
      action: GRID_ACTIONS.HISTORY,
      data: data,
    } as GridEvent<DiplomaRequest>);
  }

  onDelete(data: DiplomaRequest) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: data,
    } as GridEvent<DiplomaRequest>);
  }

  loadRows($event: TableLazyLoadEvent) {
    const filters = $event.filters as any;
    $event.filters = this.dateFilterService.applyDateManipulation(filters);
    this.lazyLoadData.emit($event);
  }

  protected readonly STUDENTS = STUDENTS;
}
