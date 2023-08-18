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
  ColumnFilterDirective, DateFilterService,
} from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { EmptySite, ExamAssignment } from '@msh/shared/domain-models';

@Component({
  selector: 'msh-empty-site-grid',
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
  templateUrl: './empty-site-grid.component.html',
  styleUrls: ['./empty-site-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptySiteGridComponent {
  @Input() emptySites: EmptySite[] = [];
  @Input() totalRecords = 0;

  //Keep it local state because of Table Header checkbox not syncing
  selectedExamAssignments: ExamAssignment[] = [];

  @Output() gridEvent = new EventEmitter<GridEvent<EmptySite | EmptySite[]>>();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();
  constructor(private dateFilterService: DateFilterService) {}

  onEmptySite(emptySite: EmptySite) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: emptySite,
    } as GridEvent<EmptySite>);
  }

  loadRows($event: TableLazyLoadEvent) {
    const filters = $event.filters as any;
    $event.filters = this.dateFilterService.applyDateManipulation(filters);
    this.lazyLoadData.emit($event);
  }
}
