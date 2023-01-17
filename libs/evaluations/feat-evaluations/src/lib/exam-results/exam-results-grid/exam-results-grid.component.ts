import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {TooltipModule} from "primeng/tooltip";
import {CheckboxModule} from "primeng/checkbox";
import {RippleModule} from "primeng/ripple";
import {HighSchool} from "@msh/configurations/domain-configurations";
import {GRID_ACTIONS, GridEvent} from "@msh/shared/util-shared";
import {LazyLoadEvent} from "primeng/api";
import {ExamResult} from "@msh/evaluations/domain-evaluations";

@Component({
  selector: 'msh-exam-result-grid',
  standalone: true,
  imports: [    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,],
  templateUrl: './exam-results-grid.component.html',
  styleUrls: ['./exam-results-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamResultsGridComponent {
  @Input() examResults: ExamResult[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedExamResults: ExamResult[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamResult | ExamResult[]>
    >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditElaborationPointsClick(examResult: ExamResult) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examResult,
      type: 'elaboration'
    } as GridEvent<ExamResult>);
    console.log(examResult)
    console.log(examResult.elaboration_points)
  }
  onEditAlternativePointsClick(examResult: ExamResult) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examResult,
      type: 'alternative'
    } as GridEvent<ExamResult>);
    console.log(examResult)
    console.log(examResult.alternative_points)
  }

  onSelectAllClick() {
    if (this.selectedExamResults.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<ExamResult>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedExamResults,
      } as GridEvent<ExamResult[]>);
    }
  }

  onRowSelect({ data }: { data: ExamResult }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<ExamResult>);
  }

  onRowUnselect({ data }: { data: ExamResult }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<ExamResult>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }









}
