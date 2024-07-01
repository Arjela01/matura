import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Diploma } from '@msh/shared/domain-models';
import {
  ColumnFilterDirective,
  DateFilterService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { AppBoolPipe, AppDatePipe } from '@msh/shared/ui-shared';

@Component({
  selector: 'msh-diplomas-student-grid',
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
  templateUrl: './diplomas-student-grid.component.html',
  styleUrls: ['./diplomas-student-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class DiplomasStudentGridComponent {
  @Input() diplomas: Diploma[] = [];
  @Input() totalRecords = 0;
  @Output() gridEvent = new EventEmitter<GridEvent<Diploma>>();
  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  constructor(private dateFilterService: DateFilterService) {}

  onPrint(data: Diploma) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.PRINT,
      data: data,
    } as GridEvent<Diploma>);
  }

  onSeal(data: Diploma) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SEAL,
      data: data,
    } as GridEvent<Diploma>);
  }

  onEalbania(data: Diploma) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.CUSTOM_ACTION1,
      data: data,
    } as GridEvent<Diploma>);
  }

  loadRows($event: TableLazyLoadEvent) {
    const filters = $event.filters as any;
    $event.filters = this.dateFilterService.applyDateManipulation(filters);
    this.lazyLoadData.emit($event);
  }
}
