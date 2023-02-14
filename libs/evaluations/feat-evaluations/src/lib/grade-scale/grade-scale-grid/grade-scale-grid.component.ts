import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { GradesScale } from '@msh/evaluations/domain-evaluations';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

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

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

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

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
