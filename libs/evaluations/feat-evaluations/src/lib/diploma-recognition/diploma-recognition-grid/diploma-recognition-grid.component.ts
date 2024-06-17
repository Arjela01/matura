import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DiplomaRecognition } from '@msh/shared/domain-models';
import {
  ColumnFilterDirective,
  DateFilterService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { SharedModule } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import {AppDatePipe} from "@msh/shared/ui-shared";

@Component({
  selector: 'msh-diploma-recognition-grid',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    SharedModule,
    TableModule,
    TooltipModule,
    AppDatePipe,
  ],
  templateUrl: './diploma-recognition-grid.component.html',
  styleUrls: ['./diploma-recognition-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiplomaRecognitionGridComponent {
  @Input() diplomaRecognitionRecords: DiplomaRecognition[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Output() gridEvent = new EventEmitter<
    GridEvent<DiplomaRecognition | DiplomaRecognition[]>
  >();
  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  constructor(private dateFilterService: DateFilterService) {}

  onEditClick(diplomaRecognition: DiplomaRecognition) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: diplomaRecognition,
    } as GridEvent<DiplomaRecognition>);
  }

  onDeleteClick(diplomaRecognition: DiplomaRecognition) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: diplomaRecognition,
    } as GridEvent<DiplomaRecognition>);
  }

  loadRows($event: TableLazyLoadEvent) {
    const filters = $event.filters as any;
    $event.filters = this.dateFilterService.applyDateManipulation(filters);
    this.lazyLoadData.emit($event);
  }
}
