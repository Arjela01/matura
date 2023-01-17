import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ExamSite } from '@msh/configurations/domain-configurations';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

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
  ],
  templateUrl: './exam-site-grid.component.html',
  styleUrls: ['./exam-site-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSiteGridComponent {
  @Input() examSites: ExamSite[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedExamSites: ExamSite[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamSite | ExamSite[]>
    >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

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

  onSelectAllClick() {
    if (this.selectedExamSites.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<ExamSite>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedExamSites,
      } as GridEvent<ExamSite[]>);
    }
  }

  onRowSelect({ data }: { data: ExamSite }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<ExamSite>);
  }

  onRowUnselect({ data }: { data: ExamSite }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<ExamSite>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
