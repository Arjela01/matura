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
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import { ExamGrade } from '@msh/shared/domain-models';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { RoleName } from '@msh/configurations/feat-configurations';
import { AppBoolPipe } from '@msh/shared/ui-shared';

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
    AppBoolPipe,
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
  userRole = '';
  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getExamGrades(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );
  constructor(
    private readonly examGradeService: ExamGradeApiService,
    private authFacade: AuthFacade,
    private readonly router: Router
  ) {
    {
      this.authFacade.token$.pipe(untilDestroyed(this)).subscribe(token => {
        if (token) {
          const decodedToken: any = jwtDecode(token);
          this.userRole =
            decodedToken[
              'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
            ];
        }
      });
    }
  }

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

  onEditClick(examGrade: ExamGrade) {
    this.router.navigate([`/evaluations/exam-grade-change/${examGrade.id}`]);
  }

  protected readonly RoleName = RoleName;
}
