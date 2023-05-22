import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ExamSite } from '@msh/shared/domain-models';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-exam-site-form',
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
    DropdownModule,
  ],
  templateUrl: './exam-site-form.component.html',
  styleUrls: ['./exam-site-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSiteFormComponent {
  @Input() administrationOffices: DropdownModel<number>[] = [];
  @Input() highSchools : DropdownModel<string>[] =[];
  @Input() set examSitesDetails(details: ExamSite | null) {
    if (details) {
      this.examSite = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<ExamSite>();
  @Output() formClose = new EventEmitter<undefined>();
  @Output() administrationOfficeChanged = new EventEmitter<string>();
  @Output() highSchoolChanged = new EventEmitter<string>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;
  administrationOfficeId:any;
  highSchoolId: any;

  examSite: ExamSite = {
    id: 0,
    name: '',
    address: '',
    quota: 0,
    administrationOfficeId: 0,
    administrationOfficeName: '',
    academicYearId: 1,
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {}

  onCancelClick() {
    this.formClose.emit();
  }
  onAdministrationOfficeChanged($event:any):void{
    this.administrationOfficeId = $event.value;
    this.administrationOfficeChanged.emit(this.administrationOfficeId)
    this.examSite.administrationOfficeId = this.administrationOfficeId
  }
  onHighSchoolChanged($event:any):void{
    this.highSchoolId = $event.value;
    this.highSchoolChanged.emit(this.highSchoolId)
    this.examSite.highSchoolId = this.highSchoolId
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examSite);
    }
  }
}
