import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ExamCopyApiService } from '@msh/evaluations/data-access-evaluations';
import { ExamCopy } from '@msh/evaluations/domain-evaluations';
import { GlobalToastService } from '@msh/shared/util-shared';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@UntilDestroy()
@Component({
  selector: 'msh-exam-copy-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    CheckboxModule,
  ],
  templateUrl: './exam-copy-details.component.html',
  styleUrls: ['./exam-copy-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamCopyDetailsComponent implements OnInit {
  submitted = false;

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

  @Input() set examCopyDetails(details: ExamCopy | null) {
    if (details) {
      this.examCopy = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<ExamCopy>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly examCopyService: ExamCopyApiService,
    private readonly toastService: GlobalToastService
  ) {}

  ngOnInit(): void {
    console.log('init');
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examCopy);
    }
  }
}
