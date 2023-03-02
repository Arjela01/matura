import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { ExamAssignmentApiService } from '@msh/configurations/data-access-configurations';
import { EmptySiteGridComponent } from '../empty-site-grid/empty-site-grid.component';
import { ExamAssignment } from '@msh/shared/domain-models';

@Component({
  selector: 'msh-manage-empty-site',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    RippleModule,
    RouterLink,
    EmptySiteGridComponent,
  ],
  templateUrl: './manage-empty-site.component.html',
  styleUrls: ['./manage-empty-site.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
@UntilDestroy()
export class ManageEmptySiteComponent {
  private examAssignmentList$$ = new BehaviorSubject<ExamAssignment[]>([]);
  examAssignmentList$ = this.examAssignmentList$$.asObservable();
  filters: LazyLoadEvent | null = null;
  totalRecords = 0;
  examDateId = 0;

  constructor(
    private readonly examAssignmentService: ExamAssignmentApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService
  ) {}

  onGridEvent(event: GridEvent<ExamAssignment | ExamAssignment[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        {
          const examAssignment = event.data as ExamAssignment;
          this.examDateId = examAssignment.examDateId;
          this.confirmationService.confirm({
            message: 'Jeni i sigurt që doni të zbrazni  qendrën?',
            accept: () => {
              this.emptySite(this.examDateId);
            },
          });
        }
        break;
    }
  }

  emptySite(examDateId: number) {
    this.examAssignmentService
      .emptySite(examDateId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.getExamAssignment(this.filters as LazyLoadEvent);
          this.toastService.showSuccess('Qendra u zbraz me sukses!');
        }
        if (!response.isSuccessful) {
          this.toastService.showError(
            'Ndodhi një problem gjatë zbrazjes së qendrës!'
          );
        }
      });
  }

  getExamAssignment($event: LazyLoadEvent): void {
    this.filters = Object.assign({}, $event);
    this.examAssignmentService
      .loadExamAssignments($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        const examAssignments = [...response.data];
        this.examAssignmentList$$.next(examAssignments);
        this.totalRecords = response.total;
      });
  }
}
