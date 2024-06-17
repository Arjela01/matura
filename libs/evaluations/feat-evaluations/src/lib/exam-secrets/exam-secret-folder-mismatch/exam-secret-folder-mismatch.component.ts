import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { ExamSecret } from '@msh/shared/domain-models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExamSecretApiService } from '@msh/evaluations/data-access-evaluations';
import { combineLatest, map, skip, tap } from 'rxjs';
import { AuthFacade } from '@msh/auth/data-access-auth';
import {AppBoolPipe} from "@msh/shared/ui-shared";

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
  ],
  templateUrl: './exam-secret-folder-mismatch.component.html',
  styleUrls: ['./exam-secret-folder-mismatch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSecretFolderMismatchComponent {
  examSecrets: ExamSecret[] = [];
  totalRecords = 0;
  loading = false;
  filters: TableLazyLoadEvent | null = null;

  constructor(
    private examSecretApiService: ExamSecretApiService,
    private cd: ChangeDetectorRef,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.loadRows(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  loadRows($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examSecretApiService
      .loadExamSecretFolderMismatch($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSecrets = response.data;
        this.totalRecords = response.total;
        this.cd.detectChanges();
      });
  }
}
