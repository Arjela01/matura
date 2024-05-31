import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ExamQuestionModel,
  StudentListPublication,
} from '@msh/shared/domain-models';
import {
  ColumnFilterDirective,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { SharedModule } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StudentListPublicationService } from '../../../../../data-access-evaluations/src/lib/student-list-publications/student-list-publication.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';

@Component({
  selector: 'msh-exam-question-grid',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    SharedModule,
    TableModule,
    TooltipModule,
    ButtonModule,
    RippleModule,
  ],
  templateUrl: './student-list-publications-grid.component.html',
  styleUrls: ['./student-list-publications-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class StudentListPublicationsGridComponent {
  constructor(
    public studentListPublicationService: StudentListPublicationService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private toastService: GlobalToastService
  ) {}

  records: StudentListPublication[] = [];
  totalRecords = 0;
  event: any;

  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamQuestionModel | ExamQuestionModel[]>
  >();
  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onRowClick(record: StudentListPublication) {
    this.router.navigate([
      '/evaluations',
      'student-list-publications',
      record.id,
      'diff',
    ]);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.event = $event;
    this.studentListPublicationService
      .loadDataStudentListPublications($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.records = response.data;
        this.cd.markForCheck();
      });
  }

  generateNewPublication() {
    this.studentListPublicationService
      .generateNewPublication()
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Procesi mbaroi me sukses!');
          this.loadRows(this.event);
        } else {
          this.toastService.showError('Ndodhi një gabim gjatë gjenerimit.');
        }
      });
  }
}
