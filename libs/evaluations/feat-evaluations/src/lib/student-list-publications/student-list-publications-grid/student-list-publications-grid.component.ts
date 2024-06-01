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
import { ConfirmationService, SharedModule } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { StudentListPublicationService } from '@msh/evaluations/data-access-evaluations';

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
    ConfirmDialogModule,
  ],
  templateUrl: './student-list-publications-grid.component.html',
  styleUrls: ['./student-list-publications-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
@UntilDestroy()
export class StudentListPublicationsGridComponent {
  constructor(
    public studentListPublicationService: StudentListPublicationService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private toastService: GlobalToastService,
    private readonly confirmationService: ConfirmationService
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
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të krijoni një publikim të ri?',
      accept: () => {
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
      },
    });
  }

  publishItem(record: any) {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të publikoni këto të dhëna?',
      accept: () => {
        this.studentListPublicationService
          .publish(record.id)
          .subscribe(response => {
            this.loadRows(this.event);
          });
      },
    });
  }

  deleteItem(record: any) {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini këtë publikim?',
      accept: () => {
        this.studentListPublicationService
          .delete(record.id)
          .subscribe(response => {
            this.loadRows(this.event);
          });
      },
    });
  }

  gotoCurrentList() {
    this.router.navigate(['/evaluations', 'student-list-publications', 'current']);
  }
}
