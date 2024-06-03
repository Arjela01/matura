import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FailingStudent } from '@msh/applications/domain-application';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ChipModule } from 'primeng/chip';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FailingStudentApiService } from '@msh/applications/data-access-applications';

@UntilDestroy()
@Component({
  selector: 'msh-failing-students-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    ChipModule,
    ColumnFilterDirective,
  ],
  templateUrl: './failing-students-list.component.html',
  styleUrls: ['./failing-students-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FailingStudentsListComponent {
  private failingStudentsList$$ = new BehaviorSubject<FailingStudent[]>([]);
  failingStudentsList$ = this.failingStudentsList$$.asObservable();
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;

  constructor(
    private readonly failingStudentsService: FailingStudentApiService,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getFailingStudentsList(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  getFailingStudentsList($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.failingStudentsService
      .loadFailingStudentsList($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.failingStudentsList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
