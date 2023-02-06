import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { LazyLoadEvent } from 'primeng/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExamGradeApiService } from '@msh/evaluations/data-access-evaluations';
import { BehaviorSubject } from 'rxjs';
import {ExamGrade} from "@msh/evaluations/domain-evaluations";

@UntilDestroy()
@Component({
  selector: 'msh-exam-grade-grid',
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
  templateUrl: './exam-grade-grid.component.html',
  styleUrls: ['./exam-grade-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamGradeGridComponent {
  private annualExamGrade$$ = new BehaviorSubject<ExamGrade[]>([]);
  annualExamGrade$ = this.annualExamGrade$$.asObservable();
  totalRecords = 0;
  filters: LazyLoadEvent | null = null;

  constructor(private readonly examGradeService: ExamGradeApiService) {}

  getExamGrades($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examGradeService
      .loadAnnualExamGrades($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.annualExamGrade$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
