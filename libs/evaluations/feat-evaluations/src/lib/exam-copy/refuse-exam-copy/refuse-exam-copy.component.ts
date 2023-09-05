import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  ExamCopyApiService,
  ExamCopyRefuse,
} from '@msh/evaluations/data-access-evaluations';
import { ExamCopy } from '@msh/shared/domain-models';
import { GlobalToastService } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@UntilDestroy()
@Component({
  selector: 'msh-refuse-exam-copy',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
  templateUrl: './refuse-exam-copy.component.html',
  styleUrls: ['./refuse-exam-copy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefuseExamCopyComponent implements OnInit {
  examCopy: ExamCopy = {
    address: undefined,
    administrationOffice: undefined,
    city: undefined,
    applicationId: undefined,
    attachedDocument: undefined,
    cel: undefined,
    comments: undefined,
    dateOfBirth: undefined,
    decisionDate: undefined,
    documentName: undefined,
    email: undefined,
    fatherName: undefined,
    firstName: undefined,
    gender: undefined,
    lastName: undefined,
    maturaId: undefined,
    municipalityUnit: undefined,
    nationality: undefined,
    nid: undefined,
    placeOfBirth: undefined,
    postalCode: undefined,
    region: undefined,
    remarks: undefined,
    schoolCode: undefined,
    schoolName: undefined,
    service: undefined,
    status: undefined,
    subject: undefined,
    telFix: undefined,
  };

  examCopyRefuse: ExamCopyRefuse = {
    applicationId: '',
  };

  applicationId = '';

  @ViewChild('form', { static: true }) form!: NgForm;

  @Input() set examCopyDetails(details: ExamCopy | null) {
    if (details) {
      this.examCopy = Object.assign({}, details);
    }
  }

  constructor(
    private cd: ChangeDetectorRef,
    private readonly examCopyService: ExamCopyApiService,
    private readonly toastService: GlobalToastService
  ) {}
  ngOnInit(): void {
    this.examCopyRefuse.applicationId = this.examCopy.applicationId ?? '';
  }

  onCancelClick() {
    window.location.reload();
  }

  onRefuse() {
    this.examCopyService
      .refuse(this.examCopyRefuse)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (!response.isSuccessful) {
          this.toastService.showError(
            response.errorMessage ?? 'Ndodhi një problem gjatë refuzimit'
          );
        }

        if (response.isSuccessful) {
          this.toastService.showSuccess('Refuzimi u krye me sukses');
          window.location.reload();
        }
      });
  }
}
