import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ExamSiteApiService } from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ExamSite } from '@msh/shared/domain-models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';

@UntilDestroy()
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
    MultiSelectModule,
  ],
  templateUrl: './exam-site-form.component.html',
  styleUrls: ['./exam-site-form.component.scss'],
})
export class ExamSiteFormComponent implements OnInit {

  isFall = false;
  @Input() administrationOffices: DropdownModel<number>[] = [];
  @Input() highschools: DropdownModel<number>[] = [];
  @Input() set examSitesDetails(details: ExamSite | null) {
    if (details) {
      this.examSite = Object.assign({}, details);
      this.isFall = this.examSite.isFall;
    }
  }

  @Output() formSave = new EventEmitter<ExamSite>();
  @Output() formClose = new EventEmitter<undefined>();
  @Output() administrationOfficeChanged = new EventEmitter<string>();
  @Output() highSchoolChanged = new EventEmitter<number[]>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;
  administrationOfficeId: any;
  highSchoolId: any;
  highSchoolArray: any = [];

  examSite: ExamSite = {
    id: 0,
    name: '',
    address: '',
    quota: 0,
    administrationOfficeId: 0,
    administrationOfficeName: '',
    academicYearId: 1,
    isFall: this.isFall
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private cd: ChangeDetectorRef,
    private readonly examSiteService: ExamSiteApiService
  ) {}

  onCancelClick() {
    this.formClose.emit();
  }
  onAdministrationOfficeChanged($event: any): void {
    if ($event && $event.value) {
      this.administrationOfficeId = $event.value;
      this.administrationOfficeChanged.emit(this.administrationOfficeId);
      this.examSite.administrationOfficeId = this.administrationOfficeId;
    }
  }

  onHighSchoolChanged($event: any): void {
    if ($event && $event.value) {
      this.highSchoolId = [...$event.value];
      this.highSchoolChanged.emit(this.highSchoolId);
      this.examSite.highschoolIds = [...this.highSchoolId];
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit({ ...this.examSite });
    }
  }
  ngOnInit() {
    if (this.examSite.id) {
      this.examSiteService
        .getExamSiteById(this.examSite.id)
        .pipe(untilDestroyed(this))
        .subscribe(response => {
          this.examSite = response.data;
          this.examSite.highschoolsNames = response.data.highschoolsNames;
          this.examSite.highschoolIds = response.data.highschoolIds;
          this.cd.markForCheck();
        });
    } else {
      this.examSite = {
        address: '',
        administrationOfficeId: 0,
        administrationOfficeName: '',
        id: null,
        name: '',
        quota: 0,
        isFall: this.isFall
      };
    }
  }
}
