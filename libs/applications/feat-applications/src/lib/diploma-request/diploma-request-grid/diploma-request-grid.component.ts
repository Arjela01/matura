import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AppBoolPipe, AppDatePipe } from '@msh/shared/ui-shared';
import { Diploma } from '@msh/shared/domain-models';
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

@Component({
  selector: 'diploma-request-grid',
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
  ],
  templateUrl: './diploma-request-grid.component.html',
  styleUrl: './diploma-request-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiplomaRequestGridComponent {
  @Input() diplomas: Diploma[] = [];
  @Input() totalRecords = 0;
  @Output() gridEvent = new EventEmitter<GridEvent<Diploma>>();
  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  constructor(private dateFilterService: DateFilterService) {}

  onEdit(data: Diploma) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: data,
    } as GridEvent<Diploma>);
  }

  onDelete(data: Diploma) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: data,
    } as GridEvent<Diploma>);
  }

  loadRows($event: TableLazyLoadEvent) {
    const filters = $event.filters as any;
    $event.filters = this.dateFilterService.applyDateManipulation(filters);
    this.lazyLoadData.emit($event);
  }
}
