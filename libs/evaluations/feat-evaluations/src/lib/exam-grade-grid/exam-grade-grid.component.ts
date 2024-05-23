import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { ExamGradeApiService } from '@msh/evaluations/data-access-evaluations';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { ExamGrade } from '@msh/shared/domain-models';

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
    ColumnFilterDirective,
  ],
  templateUrl: './exam-grade-grid.component.html',
  styleUrls: ['./exam-grade-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamGradeGridComponent {
  private examGrade$$ = new BehaviorSubject<ExamGrade[]>([]);
  examGrade$ = this.examGrade$$.asObservable();
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;
  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    map(([_]) => {
      if (this.filters) {
        this.getExamGrades(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );
  constructor(
    private readonly examGradeService: ExamGradeApiService,
    private authFacade: AuthFacade
  ) {}

  getExamGrades($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examGradeService
      .loadExamGrades($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examGrade$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  onEditClick(examGrade: any) {

  }
}
