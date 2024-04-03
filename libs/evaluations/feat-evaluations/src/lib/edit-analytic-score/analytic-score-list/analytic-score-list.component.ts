import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamQuestionScoreModel } from '@msh/shared/domain-models';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TooltipModule } from 'primeng/tooltip';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';

@UntilDestroy()
@Component({
  selector: 'msh-analytic-score-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    PaginatorModule,
    TooltipModule,
  ],
  templateUrl: './analytic-score-list.component.html',
  styleUrls: ['./analytic-score-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticScoreListComponent {
  @Input() examQuestionScoreList: any[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() totalScore = 0;
  @Input() examVariantMaximumScore = 0;
  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamQuestionScoreModel | ExamQuestionScoreModel[]>
  >();
  @Output() writingScoreChange = new EventEmitter<any>();
  onDeleteClick(examQuestionScore: any) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examQuestionScore,
    } as GridEvent<ExamQuestionScoreModel>);
  }
  onExamScoreAddOrUpdate(examQuestionScore: any) {
    this.writingScoreChange.emit(examQuestionScore);
  }
}
