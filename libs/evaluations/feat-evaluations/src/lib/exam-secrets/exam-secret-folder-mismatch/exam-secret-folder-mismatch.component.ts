import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { AcademicYear, ExamSecret } from '@msh/shared/domain-models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExamSecretApiService } from '@msh/evaluations/data-access-evaluations';
import { combineLatest, map, tap } from 'rxjs';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { AppBoolPipe } from '@msh/shared/ui-shared';
import { RouterLink } from '@angular/router';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { CustomSwitchComponent } from '@msh/shared/ui-shared';

@UntilDestroy()
@Component({
  selector: 'msh-exam-secrets-folder-mismatch',
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
    AppBoolPipe,
    RouterLink,
    InputSwitchModule,
    FormsModule,
    CustomSwitchComponent,
  ],
  templateUrl: './exam-secret-folder-mismatch.component.html',
  styleUrls: ['./exam-secret-folder-mismatch.component.scss'],
})
export class ExamSecretFolderMismatchComponent {
  examSecrets: ExamSecret[] = [];
  totalRecords = 0;
  loading = false;
  filters: TableLazyLoadEvent | null = null;
  isOn = false;
  currentAcademicYear!: Partial<AcademicYear>;

  constructor(
    private examSecretApiService: ExamSecretApiService,
    private readonly authFacade: AuthFacade,
    private cd: ChangeDetectorRef
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    map(([data]) => {
      this.currentAcademicYear = data;
      this.isOn = this.currentAcademicYear?.isFall ?? false;
      if (this.filters) {
        this.loadRows(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  onSwitchChange(event: any) {
    this.isOn = event;
    this.loadRows(this.filters as TableLazyLoadEvent);
  }

  loadRows($event: TableLazyLoadEvent) {
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
      const { isFall, ...restFilters } = this.filters.filters || {};
      this.filters.filters = restFilters;
    }

    this.examSecretApiService
      .loadExamSecretFolderMismatch(this.filters)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSecrets = response.data;
        this.totalRecords = response.total;
        this.cd.detectChanges();
      });
  }
}
