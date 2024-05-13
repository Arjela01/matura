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
import { SearchOptions } from '@msh/shared/domain-models';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { GlobalToastService } from '@msh/shared/util-shared';
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
  ],
  templateUrl: './exam-question-score-filters.component.html',
  styleUrls: ['./exam-question-score-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamQuestionScoreFiltersComponent {
  @ViewChild('form', { static: true }) form!: NgForm;

  @Input() examType: DropdownModel<number>[] = [];
  @Input() examSubject: DropdownModel<string>[] = [];
  @Input() examVariant: DropdownModel<string>[] = [];

  @Output() formSave = new EventEmitter<SearchOptions>();
  @Output() examSubjectChanged = new EventEmitter<SearchOptions>();
  @Output() examTypeChanged = new EventEmitter<SearchOptions>();
  @Output() examVariantChanged = new EventEmitter<SearchOptions>();

  examQuestionScoreList: SearchOptions = {} as SearchOptions;
  submitted = false;

  constructor(
    private readonly toastService: GlobalToastService,
    private elementRef: ElementRef
  ) {}

  onExamTypeChanged(): void {
    if (this.examQuestionScoreList.examTypeId) {
      this.examSubjectChanged.emit(
        Object.assign({}, this.examQuestionScoreList)
      );
    }
  }

  onExamSubjectChanged(): void {
    if (this.examQuestionScoreList.examSubjectId) {
      this.examVariantChanged.emit(
        Object.assign({}, this.examQuestionScoreList)
      );
    }
  }

  onSubmit() {
    if (this.isSearchValid(this.examQuestionScoreList)) {
      this.formSave.emit(this.examQuestionScoreList);
    } else {
      this.toastService.showInfo(
        'Ju lutem plotësoni të gjitha fushat e kërkuara.'
      );
    }
  }

  isSearchValid(searchModal: SearchOptions) {
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

  @HostListener('window:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      const barcodeField =
        this.elementRef.nativeElement.querySelector('#barcode');
      if (barcodeField) {
        barcodeField.focus();
      }
    }
  }
}
