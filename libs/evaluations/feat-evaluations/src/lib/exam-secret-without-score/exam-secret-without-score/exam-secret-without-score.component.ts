import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { ExamSecretApiService } from '@msh/evaluations/data-access-evaluations';
import { ExamSecret } from '@msh/shared/domain-models';
import { AppBoolPipe } from '@msh/shared/ui-shared';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SharedModule } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { combineLatest, distinctUntilChanged, skip, tap } from 'rxjs';
import { CustomSwitchComponent } from '@msh/layout/feat-layout';

@UntilDestroy()
@Component({
  selector: 'msh-exam-secret-without-score',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    SharedModule,
    TableModule,
    AppBoolPipe,
    CustomSwitchComponent,
  ],
  templateUrl: './exam-secret-without-score.component.html',
  styleUrls: ['./exam-secret-without-score.component.scss'],
})
export class ExamSecretWithoutScoreComponent {
  examSecretWithoutScore: ExamSecret[] = [];
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;
  isOn = false;

  constructor(
    private readonly examSecretService: ExamSecretApiService,
    private readonly authFacade: AuthFacade,
    private cd: ChangeDetectorRef
  ) {}

  changes$ = combineLatest([
    this.authFacade.academicYear$.pipe(skip(1)),
    this.authFacade.isFall$.pipe(
      tap(isFall => {
        this.isOn = isFall;
      })
    ),
  ])
    .pipe(
      distinctUntilChanged(),
      skip(1),
      untilDestroyed(this),
      tap(() => {
        if (this.filters) {
          this.loadData(this.filters as TableLazyLoadEvent);
        }
      })
    )
    .subscribe();

  onSwitchChange(event: any) {
    this.isOn = event;
    this.loadData(this.filters as TableLazyLoadEvent);
  }

  loadData($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    if (this.isOn) {
      this.filters.filters = {
        ...this.filters.filters,
        isFall: {
          value: this.isOn,
          matchMode: 'equals',
        },
      };
    } else {
      const { isFall, ...restFilters } = this.filters.filters || {};
      this.filters.filters = restFilters;
    }

    this.examSecretService
      .loadExamSecretsWithoutExamScoresData(this.filters)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSecretWithoutScore = response.data;
        this.totalRecords = response.total;
        this.cd.detectChanges();
      });
  }
}
