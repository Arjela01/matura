import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AuthFacade } from '@msh/auth/data-access-auth';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ExamGrade } from '@msh/shared/domain-models';
import { RouterLink } from '@angular/router';
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
    ColumnFilterDirective,
    AppBoolPipe,
    RouterLink,
  ],
  templateUrl: './exam-grade-grid.component.html',
  styleUrls: ['./exam-grade-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamGradeGridComponent {
  @Input() examGrades: ExamGrade[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

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

  protected readonly RoleName = RoleName;
}
