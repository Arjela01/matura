import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ExamQuestionModel,
  StudentListPublicationDiffRecord,
} from '@msh/shared/domain-models';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { SharedModule } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StudentListPublicationService } from '../../../../../data-access-evaluations/src/lib/student-list-publications/student-list-publication.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'msh-exam-question-grid',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    SharedModule,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './diff-student-list-publications-records.component.html',
  styleUrls: ['./diff-student-list-publications-records.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class DiffStudentListPublicationsRecordsComponent {
  id: string | null = null;

  constructor(
    public studentListPublicationService: StudentListPublicationService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  records: StudentListPublicationDiffRecord[] = [];

  examQuestions: ExamQuestionModel[] = [];
  totalRecords = 0;

  loadRows($event: TableLazyLoadEvent) {
    if (!this.id) return;
    this.studentListPublicationService
      .loadDataStudentListPublicationDiffRecords(this.id, $event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.records = response.data;
        this.cd.markForCheck();
      });
  }
}
