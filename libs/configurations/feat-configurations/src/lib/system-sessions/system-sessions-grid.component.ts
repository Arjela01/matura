import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthFacade } from '@msh/auth/data-access-auth';
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
import { RouterLink } from '@angular/router';
import { SystemSessionsModel } from '@msh/shared/domain-models';
import { SystemSessionsService } from '@msh/configurations/data-access-configurations';
import { AppTimePipe } from '@msh/shared/ui-shared';
@UntilDestroy()
@Component({
  selector: 'msh-system-sessions',
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
    RouterLink,
    AppTimePipe,
  ],
  templateUrl: './system-sessions-grid.component.html',
  styleUrls: ['./system-sessions-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemSessionsGridComponent {
  private sessions$$ = new BehaviorSubject<SystemSessionsModel[]>([]);
  sessions$ = this.sessions$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  totalRecords = 0;
  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getSessions(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );
  constructor(
    private readonly systemSessions: SystemSessionsService,
    private authFacade: AuthFacade
  ) {}

  getSessions($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.systemSessions
      .loadSessions($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.sessions$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
