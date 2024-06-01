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
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { StudentListPublicationService } from '@msh/evaluations/data-access-evaluations';

@Component({
  selector: 'msh-current-student-list-publications-records',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    SharedModule,
    TableModule,
    TooltipModule,
    ButtonModule,
  ],
  templateUrl: './current-student-list-publications-records.component.html',
  styleUrls: ['./current-student-list-publications-records.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class CurrentStudentListPublicationsRecordsComponent {
  constructor(
    public studentListPublicationService: StudentListPublicationService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  records: StudentListPublicationDiffRecord[] = [];
  totalRecords = 0;

  loadRows($event: TableLazyLoadEvent) {
    this.studentListPublicationService
      .loadDataStudentListPublicationCurrentRecords($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.records = response.data;
        this.totalRecords = response.total;
        this.cd.markForCheck();
      });
  }

  onBackButtonClick() {
    this.router.navigate(['/evaluations', 'student-list-publications']);
  }
}
