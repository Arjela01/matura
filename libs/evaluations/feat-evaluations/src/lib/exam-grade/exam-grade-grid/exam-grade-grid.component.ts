import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { RoleName } from '@msh/configurations/feat-configurations';
import { ExamGrade, Student } from '@msh/shared/domain-models';
import { AppBoolPipe } from '@msh/shared/ui-shared';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { jwtDecode } from 'jwt-decode';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ExamGradeHistoryComponent } from '../exam-grade-history/exam-grade-history.component';
import { TooltipModule } from 'primeng/tooltip';

@UntilDestroy()
@Component({
  selector: 'msh-exam-grade-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ColumnFilterDirective,
    AppBoolPipe,
    RouterLink,
    DialogModule,
    ExamGradeHistoryComponent,
    TooltipModule,
  ],
  templateUrl: './exam-grade-grid.component.html',
  styleUrls: ['./exam-grade-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamGradeGridComponent {
  @Input() examGrades: ExamGrade[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() studentId: any;
  @Input() headerText = '';
  @Input() displayHistoryForm = true;
  @Input() selectedRecord: any;

  @Output() gridEvent = new EventEmitter<GridEvent<ExamGrade | ExamGrade[]>>();
  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  userRole = '';
  constructor(private authFacade: AuthFacade) {
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

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }

  onEditClick(grade: ExamGrade) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: grade,
    } as GridEvent<ExamGrade>);
  }

  onHistoryClick(student: Student) {
    this.displayHistoryForm = true;
    this.gridEvent.emit({
      action: GRID_ACTIONS.HISTORY,
      data: student,
    } as GridEvent<Student>);
  }

  onDeleteClick(grade: ExamGrade) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: grade,
    } as GridEvent<ExamGrade>);
  }

  protected readonly RoleName = RoleName;
}
