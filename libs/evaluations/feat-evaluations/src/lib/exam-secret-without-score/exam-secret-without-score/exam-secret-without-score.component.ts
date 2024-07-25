import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { ExamSecretApiService } from '@msh/evaluations/data-access-evaluations';
import { AcademicYear, ExamSecret } from '@msh/shared/domain-models';
import { AppBoolPipe } from '@msh/shared/ui-shared';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SharedModule } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { combineLatest, distinctUntilChanged, map, tap } from 'rxjs';
import { CustomSwitchComponent } from '@msh/shared/ui-shared';

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
  currentAcademicYear!: Partial<AcademicYear>;

  constructor(
    private readonly examSecretService: ExamSecretApiService,
    private readonly authFacade: AuthFacade,
    private cd: ChangeDetectorRef
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    distinctUntilChanged(),
    map(([data]) => {
      this.currentAcademicYear = data;
      this.isOn = this.currentAcademicYear?.isFall ?? false;
      if (this.filters) {
        this.loadData(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  onSwitchChange(event: any) {
    this.isOn = event;
    this.loadData(this.filters as TableLazyLoadEvent);
  }

  ngOnInit(): void {
    this.academicYear$.pipe(untilDestroyed(this)).subscribe();
  }

  loadData($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    if (this.isOn && this.currentAcademicYear?.isFall) {
      this.filters.filters = {
        ...this.filters.filters,
        isFall: {
          value: this.currentAcademicYear.isFall,
          matchMode: 'equals',
        },
      };
    } else {
      this.filters.filters = {};
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
