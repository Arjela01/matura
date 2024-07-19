import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  ExamQuestionModel,
  GradeListPublicationDiffRecord,
} from '@msh/shared/domain-models';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { SharedModule } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { GradeListPublicationService } from '@msh/evaluations/data-access-evaluations';
import { AppBoolPipe, AppDatePipe } from '@msh/shared/ui-shared';

@Component({
  selector: 'msh-diff-grade-list-publications-records',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    SharedModule,
    TableModule,
    TooltipModule,
    ButtonModule,
    DatePipe,
    AppDatePipe,
    AppBoolPipe,
  ],
  templateUrl: './diff-grade-list-publications-records.component.html',
  styleUrls: ['./diff-grade-list-publications-records.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
@UntilDestroy()
export class DiffGradeListPublicationsRecordsComponent {
  id: string | null = null;

  constructor(
    public gradeListPublicationService: GradeListPublicationService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  records: GradeListPublicationDiffRecord[] = [];

  examQuestions: ExamQuestionModel[] = [];
  totalRecords = 0;

  loadRows($event: TableLazyLoadEvent) {
    if (!this.id) return;
    this.gradeListPublicationService
      .loadDataGradeListPublicationDiffRecords(this.id, $event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.records = response.data;
        this.totalRecords = response.total;
        this.cd.markForCheck();
      });
  }

  onBackButtonClick() {
    this.router.navigate(['/evaluations', 'grade-list-publications']);
  }
}
