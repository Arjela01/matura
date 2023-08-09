import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { ExamScore } from '@msh/shared/domain-models';
import { ExamScoreApiService } from '@msh/evaluations/data-access-evaluations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'msh-exam-scores-folder-mismatch',
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
  templateUrl: './exam-score-folder-mismatch.component.html',
  styleUrls: ['./exam-score-folder-mismatch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamScoreFolderMismatchComponent {
  examScores: ExamScore[] = [];
  totalRecords = 0;
  loading = false;

  constructor(
    private examScoreApiService: ExamScoreApiService,
    private cd: ChangeDetectorRef
  ) {}

  @Output() gridEvent = new EventEmitter<GridEvent<ExamScore | ExamScore[]>>();

  onEditClick(examScore: ExamScore) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examScore,
    } as GridEvent<ExamScore>);
  }

  onDeleteClick(examScore: ExamScore) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examScore,
    } as GridEvent<ExamScore>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.examScoreApiService
      .loadExamScoreFolderMismatch($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examScores = response.data;
        this.totalRecords = response.total;
        this.cd.detectChanges();
      });
  }
}
