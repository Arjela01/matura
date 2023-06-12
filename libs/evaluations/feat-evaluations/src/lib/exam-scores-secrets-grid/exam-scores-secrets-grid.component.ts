import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { BehaviorSubject } from 'rxjs';
import {  ExamScore } from '@msh/evaluations/domain-evaluations';
import { LazyLoadEvent } from 'primeng/api';
import {
  ExamScoreApiService,
} from '@msh/evaluations/data-access-evaluations';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ColumnFilterDirective} from "@msh/shared/util-shared";
@UntilDestroy()

@Component({
  selector: 'msh-exam-score-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    ColumnFilterDirective
  ],
  templateUrl: './exam-scores-secrets-grid.component.html',
  styleUrls: ['./exam-scores-secrets-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamScoresSecretsGridComponent {
  private examScores$$ = new BehaviorSubject<ExamScore[]>([]);
  examScores$ = this.examScores$$.asObservable();
  filters: LazyLoadEvent | null = null;
  totalRecords = 0;

  constructor(private readonly examScoreService: ExamScoreApiService) {}

  getExamScores($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examScoreService
      .loadExamScores($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examScores$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
