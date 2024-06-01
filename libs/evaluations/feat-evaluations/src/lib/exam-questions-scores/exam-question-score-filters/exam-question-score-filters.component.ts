import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ExamQuestionScoreTotal } from '@msh/shared/domain-models';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {
  BARCODE_REGEX,
  GlobalToastService,
  UpperCaseInputDirective,
} from '@msh/shared/util-shared';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'msh-exam-question-score-filters',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    PaginatorModule,
    InputTextModule,
    TooltipModule,
    UpperCaseInputDirective,
  ],
  templateUrl: './exam-question-score-filters.component.html',
  styleUrls: ['./exam-question-score-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamQuestionScoreFiltersComponent {
  @ViewChild('form', { static: true }) form!: NgForm;

  @Input() examTypes: DropdownModel<number>[] = [];
  @Input() examSubjects: DropdownModel<string>[] = [];
  @Input() examVariants: DropdownModel<string>[] = [];
  @Input() examQuestionScoreTotal: ExamQuestionScoreTotal = {};

  @Output() formSave = new EventEmitter<ExamQuestionScoreTotal>();
  @Output() examSubjectChanged = new EventEmitter<ExamQuestionScoreTotal>();
  @Output() examTypeChanged = new EventEmitter<ExamQuestionScoreTotal>();
  @Output() examVariantChanged = new EventEmitter<ExamQuestionScoreTotal>();

  submitted = false;
  barcodePattern = BARCODE_REGEX;

  constructor(
    private readonly toastService: GlobalToastService,
    private elementRef: ElementRef
  ) {}

  onExamTypeChanged(): void {
    if (this.examQuestionScoreTotal.examTypeId) {
      this.examSubjectChanged.emit(
        Object.assign({}, this.examQuestionScoreTotal)
      );
    }
  }

  onExamSubjectChanged(): void {
    if (this.examQuestionScoreTotal.examSubjectId) {
      this.examVariantChanged.emit(
        Object.assign({}, this.examQuestionScoreTotal)
      );
    }
  }

  defaultOnSubmit($event: any) {
    $event.preventDefault();
    return false;
  }

  onSubmit() {
    if (
      !(this.examQuestionScoreTotal.barcode ?? '').match(this.barcodePattern)
    ) {
      this.toastService.showError('Barkodi nuk është i formatit të duhur.');
      return;
    }

    if (this.isSearchValid(this.examQuestionScoreTotal)) {
      this.formSave.emit(this.examQuestionScoreTotal);
    } else {
      this.toastService.showInfo(
        'Ju lutem plotësoni të gjitha fushat e kërkuara.'
      );
    }
  }

  isSearchValid(searchModal: ExamQuestionScoreTotal) {
    return (
      searchModal.examVariantId &&
      searchModal.examTypeId &&
      searchModal.examSubjectId &&
      searchModal.barcode &&
      searchModal.testNumber
    );
  }

  clearFields() {
    this.form.controls['testNumber'].setValue('');
    this.form.controls['barcode'].setValue('');

    setTimeout(() => {
      const testNumberField =
        this.elementRef.nativeElement.querySelector('#testNumber');
      if (testNumberField) {
        testNumberField.focus();
      }
    });
  }

  onKeyPress() {
    setTimeout(() => {
      const testNumberField =
        this.elementRef.nativeElement.querySelector('#barcode');
      if (testNumberField) {
        testNumberField.focus();
      }
    });
  }

  protected readonly BARCODE_REGEX = BARCODE_REGEX;
}
