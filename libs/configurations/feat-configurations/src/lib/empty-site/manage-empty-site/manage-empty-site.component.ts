import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import {
  EmptySiteApiService,
  ExamAssignmentApiService,
} from '@msh/configurations/data-access-configurations';
import { EmptySiteGridComponent } from '../empty-site-grid/empty-site-grid.component';
import { EmptySite } from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';
import { AuthFacade } from '@msh/auth/data-access-auth';

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
  private emptySiteList$$ = new BehaviorSubject<EmptySite[]>([]);
  emptySiteList$ = this.emptySiteList$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  totalRecords = 0;
  examDateId = 0;

  constructor(
    private readonly emptySiteService: EmptySiteApiService,
    private readonly examAssignmentService: ExamAssignmentApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getEmptySites(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  onGridEvent(event: GridEvent<EmptySite | EmptySite[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        {
          const examAssignment = event.data as EmptySite;
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
    this.emptySiteService
      .emptySite(examDateId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.getEmptySites(this.filters as TableLazyLoadEvent);
          this.toastService.showSuccess('Qendra u zbraz me sukses!');
        } else this.toastService.showError(response.errorMessage);
        if (!response.isSuccessful) {
          this.toastService.showError(
            'Ndodhi një problem gjatë zbrazjes së qendrës!'
          );
        }
      });
  }

  getEmptySites($event: TableLazyLoadEvent): void {
    this.filters = Object.assign({}, $event);
    this.emptySiteService
      .loadEmptySite($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        const emptySites = [...response.data];
        this.emptySiteList$$.next(emptySites);
        this.totalRecords = response.total;
      });
  }
}
