import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ExamCopyApiService } from '@msh/evaluations/data-access-evaluations';
import { ExamCopy } from '@msh/evaluations/domain-evaluations';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { ExamCopyDetailsComponent } from '../exam-copy-details/exam-copy-details.component';
import { ExamCopyGridComponent } from '../exam-copy-grid/exam-copy-grid.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-copy',
  standalone: true,
  templateUrl: './manage-exam-copy.component.html',
  styleUrls: ['./manage-exam-copy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
  imports: [
    CommonModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    ToolbarModule,
    RippleModule,
    ConfirmDialogModule,
    ExamCopyGridComponent,
    ExamCopyDetailsComponent,
  ],
})
export class ManageExamCopyComponent implements OnInit {
  private examCopies$$ = new BehaviorSubject<ExamCopy[]>([]);
  examCopies$ = this.examCopies$$.asObservable();
  filters: LazyLoadEvent | null = null;

  selecetdExamCopy: ExamCopy | null = null;

  totalRecords = 0;
  displayModal = false;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly examCopyService: ExamCopyApiService,
    private readonly toastService: GlobalToastService,
    private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    console.log('init');
  }

  onGridEvent(event: GridEvent<ExamCopy | ExamCopy[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.selecetdExamCopy = Object.assign({}, event.data as ExamCopy);
        this.displayModal = true;
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
    this.selecetdExamCopy = null;
  }

  onFormSave(examCopy: ExamCopy) {
    console.log(examCopy);
  }

  getExamCopies($event: any) {
    this.examCopies$$.next([
      {
        address: 'address',
        city: 'city',
        administrationOffice: 'administrationOffice',
        applicationId: 'applicationId',
        attachedDocument: 'attachedDocument',
        cel: 'cel',
        comments: 'comments',
        dateOfBirth: 'dateOfBirth',
        decisionDate: 'decisionDate',
        documentName: 'documentName',
        email: 'email',
        fatherName: 'fatherName',
        firstName: 'firstName',
        gender: 'gender',
        lastName: 'lastName',
        maturaId: 'maturaId',
        municipalityUnit: 'municipalityUnit',
        nationality: 'nationality',
        nid: 'nid',
        placeOfBirth: 'placeOfBirth',
        postalCode: 'postalCode',
        region: 'region',
        remarks: 'remarks',
        schoolCode: 'schoolCode',
        schoolName: 'schoolName',
        service: 'service',
        status: 0,
        subject: 'subject',
        telFix: 'telFix',
      },
      {
        address: 'address',
        city: 'city',
        administrationOffice: 'administrationOffice',
        applicationId: 'applicationId',
        attachedDocument: 'attachedDocument',
        cel: 'cel',
        comments: 'comments',
        dateOfBirth: 'dateOfBirth',
        decisionDate: 'decisionDate',
        documentName: 'documentName',
        email: 'email',
        fatherName: 'fatherName',
        firstName: 'firstName',
        gender: 'gender',
        lastName: 'lastName',
        maturaId: 'maturaId',
        municipalityUnit: 'municipalityUnit',
        nationality: 'nationality',
        nid: 'nid',
        placeOfBirth: 'placeOfBirth',
        postalCode: 'postalCode',
        region: 'region',
        remarks: 'remarks',
        schoolCode: 'schoolCode',
        schoolName: 'schoolName',
        service: 'service',
        status: 1,
        subject: 'subject',
        telFix: 'telFix',
      },
    ]);
    //   this.examCopyService
    //     .getExamCopies(this.filters)
    //     .pipe(untilDestroyed(this))
    //     .subscribe(
    //       (response) => {
    //         this.examCopies$$.next(response.data);
    //         this.totalRecords = response.totalRecords;
    //         this.cd.markForCheck();
    //       },
    //       (error) => {
    //         this.toastService.showError(error);
    //       }
    //     );
    // }
    console.log('getExamCopies');
  }
}
