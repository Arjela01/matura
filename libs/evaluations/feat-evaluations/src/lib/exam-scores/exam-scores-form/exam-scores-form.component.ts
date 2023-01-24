import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, NgForm} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import {ExamScore} from "@msh/evaluations/domain-evaluations";
import {DropdownModel} from "@msh/shared/data-access-shared";
import {DropdownModule} from "primeng/dropdown";
import {AutoCompleteModule} from "primeng/autocomplete";

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
    AutoCompleteModule
  ],
  templateUrl: './exam-scores-form.component.html',
  styleUrls: ['./exam-scores-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamScoresFormComponent {
  @Input() examType: string | undefined;
  @Output() formSave = new EventEmitter<ExamScore>();
  @Output() formClose = new EventEmitter<undefined>();
  @Input() academicYears: DropdownModel<number>[] = [];
  @Input() students: DropdownModel<number>[] = [];
  @ViewChild('form', {static: true}) form!: NgForm;
  submitted = false;
  examScore: ExamScore = {
    id: 0,
    barcode: '',
    examSubjectCode: 0,
    isFall: false,
    writingScore: 0,
    multipleChoiceScore: 0,
    documentName: ''
  };




  currentYear: number = new Date().getFullYear()

  @ViewChild('academicYear') academicYear!: ElementRef;
  selectedYear = '';
  onSelected() {
    this.selectedYear = this.academicYear.nativeElement.value;
  }
  @Input() set examScoreDetails(details: ExamScore | null) {
    let val;
    if (details) {
      this.examScore = Object.assign({}, details);
    }
  }




  // currentYearObj: any = this.academicYears







  search(event: any) {
    // this.mylookupservice.getResults(event.query).then(data => {
    //   this.students = data;
    // });
  }
  onCancelClick() {
    this.formClose.emit();
  }


  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examScore);
    }
  }
}
