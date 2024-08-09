import { CommonModule, DatePipe } from '@angular/common';
import {
  signal,
  computed,
  Component,
  ChangeDetectorRef,
  effect,
  CreateEffectOptions,
} from '@angular/core';
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
import { combineLatest, map, skip, tap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AcademicYear, SystemSessionsModel } from '@msh/shared/domain-models';
import { SystemSessionsService } from '@msh/configurations/data-access-configurations';
import { AppDatePipe, AppTimePipe } from '@msh/shared/ui-shared';

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
    AppDatePipe,
  ],
  templateUrl: './system-sessions-grid.component.html',
  styleUrls: ['./system-sessions-grid.component.scss'],
  providers: [AppDatePipe, DatePipe],
})
export class SystemSessionsGridComponent {
  sessions = signal<SystemSessionsModel[]>([]);
  filters = signal<TableLazyLoadEvent | null>(null);
  totalRecords = signal<number>(0);
  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters()) {
        this.getSessions(this.filters() as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  constructor(
    private readonly systemSessions: SystemSessionsService,
    private authFacade: AuthFacade,
    private readonly cd: ChangeDetectorRef
  ) {}

  getSessions($event: TableLazyLoadEvent) {
    this.filters.set(Object.assign({}, $event));

    this.systemSessions
      .loadSessions($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.sessions.set(response.data);
        this.totalRecords.set(response.total);
        this.cd.detectChanges();
      });
  }
}
