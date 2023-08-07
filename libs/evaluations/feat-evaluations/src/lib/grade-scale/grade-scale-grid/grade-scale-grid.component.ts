import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  GridEvent,
  GRID_ACTIONS,
  ColumnFilterDirective,
} from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { GradesScale } from '@msh/shared/domain-models';

@Component({
  selector: 'msh-grade-scale-grid',
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
  templateUrl: './grade-scale-grid.component.html',
  styleUrls: ['./grade-scale-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradeScaleGridComponent {
  @Input() gradeScales: GradesScale[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  @Output() gridEvent = new EventEmitter<GridEvent<GradesScale>>();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onEditClick(scale: GradesScale) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: scale,
    } as GridEvent<GradesScale>);
  }

  onViewClick(scale: GradesScale) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: scale,
    } as GridEvent<GradesScale>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
