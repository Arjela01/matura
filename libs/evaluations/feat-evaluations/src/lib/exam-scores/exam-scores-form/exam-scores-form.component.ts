import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ExamScoreApiService } from '@msh/evaluations/data-access-evaluations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ExamScore } from '@msh/shared/domain-models';
import { GlobalToastService } from '@msh/shared/util-shared';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-exam-score-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    DropdownModule,
    AutoCompleteModule,
    TooltipModule,
  ],
  templateUrl: './exam-scores-form.component.html',
  styleUrls: ['./exam-scores-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamScoresFormComponent implements OnChanges {
  @Input() examTypes: DropdownModel<number>[] = [];
  @Input() examSubjects: DropdownModel<string>[] = [];

  @Output() formSave = new EventEmitter<ExamScore>();
  @Output() formClose = new EventEmitter<undefined>();
  @Output() examTypeChanged = new EventEmitter<string>();
  @Output() examSubjectChanged = new EventEmitter<string>();

  @ViewChild('form', { static: true }) form!: NgForm;
  submitted = false;

  examScore: ExamScore = {
    archiveExamIndex: 0,
    archiveFolderNr: 0,
    barcode: '',
    documentName: '',
    examSecretId: '',
    id: 0,
    modificationReason: '',
    multipleChoiceScore: 0,
    academicYearId: 1,
    writingScore: 0,
    maximumValueMultipleScore: 0,
    maximumValueWritingScore: 0,
    isFall: false,
  };
  examTypeId: any;
  examSubjectId: any;
  currentYear = new Date().getFullYear();
  barcodeExists = false;

  @Input() set examScoreDetails(details: ExamScore | null) {
    this.examScore = Object.assign({}, details);
    if (details && details.barcode) {
      this.onGetIndexClick(details.barcode);
    }
  }

  constructor(
    private cd: ChangeDetectorRef,
    private examScores: ExamScoreApiService,
    private readonly toastService: GlobalToastService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.examTypeId = this.examScore.examTypeId;
    this.examSubjectId = this.examScore.examSubjectId;
    this.cd.markForCheck();
  }

  onCancelClick(): void {
    this.formClose.emit();
  }

  onSubmit(): void {
    if (this.barcodeExists) {
      this.formSave.emit(this.examScore);
    }
  }
  onExamTypeChanged($event: any): void {
    this.examTypeId = $event.value;
    this.examTypeChanged.emit(this.examTypeId);
    this.examScore.examTypeId = this.examTypeId;
  }

  onExamSubjectChanged($event: any): void {
    this.examSubjectId = $event.value;
    this.examSubjectChanged.emit(this.examSubjectId);
    this.examScore.examSubjectId = this.examSubjectId;
  }

  onGetIndexClick(barcode: any) {
    this.examScores.getIndex(barcode).subscribe(res => {
      if (res.isSuccessful) {
        this.examScore.archiveExamIndex = res.data?.index;
        this.examScore.archiveFolderNr = res.data?.archiveFolderNr;
        this.barcodeExists = true;
      } else {
        this.barcodeExists = false;
        this.toastService.showError(res.errorMessage);
      }
      this.cd.markForCheck();
    });
  }
}
