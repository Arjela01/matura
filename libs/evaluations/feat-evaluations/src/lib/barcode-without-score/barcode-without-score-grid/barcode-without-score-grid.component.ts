import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { ExamGrade, statuses } from '@msh/shared/domain-models';
import { ArchiveExamApiService } from '@msh/evaluations/data-access-evaluations';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { RouterLink } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'msh-barcode-without-score-grid',
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
    DropdownModule,
    FormsModule,
  ],
  templateUrl: './barcode-without-score-grid.component.html',
  styleUrls: ['./barcode-without-score-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarcodeWithoutScoreGridComponent {
  private barcodeWithoutScoresList$$ = new BehaviorSubject<ExamGrade[]>([]);
  barcodeWithoutScoresList$ = this.barcodeWithoutScoresList$$.asObservable();
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;
  constructor(private readonly archiveExamService: ArchiveExamApiService) {}

  getBarcodeWithoutScoresList($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.archiveExamService
      .getBarcodeWithoutScore($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.barcodeWithoutScoresList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  protected readonly statuses = statuses;
}
