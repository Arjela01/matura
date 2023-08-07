import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { ExamGrade } from '@msh/shared/domain-models';
import { LazyLoadEvent } from 'primeng/api';
import { ArchiveExamApiService } from '@msh/evaluations/data-access-evaluations';

import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { RouterLink } from '@angular/router';

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
  ],
  templateUrl: './barcode-without-score-grid.component.html',
  styleUrls: ['./barcode-without-score-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarcodeWithoutScoreGridComponent implements OnInit {
  private barcodeWithoutScoresList$$ = new BehaviorSubject<ExamGrade[]>([]);
  barcodeWithoutScoresList$ = this.barcodeWithoutScoresList$$.asObservable();

  constructor(private readonly archiveExamService: ArchiveExamApiService) {}
  ngOnInit() {
    this.getBarcodeWithoutScoresList();
  }

  getBarcodeWithoutScoresList() {
    this.archiveExamService
      .getBarcodeWithoutScore()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.barcodeWithoutScoresList$$.next(response.data);
      });
  }
}
