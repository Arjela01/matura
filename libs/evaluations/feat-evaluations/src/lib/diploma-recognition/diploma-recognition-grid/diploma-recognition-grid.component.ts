import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiplomaRecognition } from '@msh/shared/domain-models';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { SharedModule } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-diploma-recognition-grid',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    SharedModule,
    TableModule,
    TooltipModule,
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
    this.lazyLoadData.emit($event);
  }
}
