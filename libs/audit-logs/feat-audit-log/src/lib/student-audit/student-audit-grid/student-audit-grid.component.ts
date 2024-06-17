import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { DialogModule } from 'primeng/dialog';
import { SharedModule } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject } from 'rxjs';
import { ExamGrade, Student } from '@msh/shared/domain-models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StudentsAuditService } from '@msh/audit-logs/data-access-audit-log';
import { RouterLink } from '@angular/router';
import { AppBoolPipe, AppDatePipe } from '@msh/shared/ui-shared';

@UntilDestroy()
@Component({
  selector: 'msh-student-audit-grid',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    DialogModule,
    SharedModule,
    TableModule,
    TooltipModule,
    RouterLink,
    DatePipe,
    AppDatePipe,
    AppBoolPipe,
  ],
  templateUrl: './student-audit-grid.component.html',
  styleUrls: ['./student-audit-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class StudentAuditGridComponent {
  private studentAuditList$$ = new BehaviorSubject<Student[]>([]);
  studentAuditList$ = this.studentAuditList$$.asObservable();
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;
  constructor(private readonly studentAuditService: StudentsAuditService) {}

  getStudents($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.studentAuditService
      .loadStudents($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.studentAuditList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
