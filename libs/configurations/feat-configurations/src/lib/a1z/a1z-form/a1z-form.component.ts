import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AcademicYearApiService } from '@msh/configurations/data-access-configurations';
import { A1Z } from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-a1z-form',
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
    CalendarModule,
    DropdownModule,
  ],
  templateUrl: './a1z-form.component.html',
  styleUrls: ['./a1z-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class A1zFormComponent implements OnChanges, OnInit {
  //TODO: Add logic for single form edit details

  @Output() formSave = new EventEmitter<A1Z>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;
  academicYears: DropdownModel<number>[] = [];

  showZ1Subjects = false;
  submitted = false;

  a1z: A1Z = {
    id: 0,
    academicYear: '',
    isA1: 'A1Z',
    createdOn: '',
    isApplyingToForeignCountries: false,
    nid: '',
    studentBirthDate: '',
    studentBirthPlace: '',
    studentFatherName: '',
    studentFirstName: '',
    studentIdentifier: '',
    studentLastName: '',
    studentOldIdentifier: '',
  };

  a1zNotImplementedProps = {
    a1zCategory: '',
    hasDiploma: false,
    graduatedYear: '',
    d1Subject: '',
    d2Subject: '',
    d3Subject: '',
    d1Grade: 0,
    d2Grade: 0,
    d3Grade: 0,
    d1Reason: '',
    d2Reason: '',
    d3Reason: '',
    hasZ1Subject: false,
    z1Subject: '',
    z1Year: '',
    z1Grade: '',
    z1Reason: '',
    overseerCode: '',
  };

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      console.log(this.a1z, this.a1zNotImplementedProps);
    }
    console.log(this.a1z, this.a1zNotImplementedProps);
  }

  constructor(
    private cd: ChangeDetectorRef,
    private readonly academicYearService: AcademicYearApiService
  ) {}
  ngOnInit(): void {
    this.academicYearService.loadDropdownList().subscribe(response => {
      this.academicYears = response.data;
    });
    console.log('init');
  }

  ngOnChanges(): void {
    console.log(this.a1zNotImplementedProps.hasZ1Subject);
    this.onZ1Change({ value: this.a1zNotImplementedProps.hasZ1Subject });
  }

  onZ1Change($event: any) {
    console.log($event);
    this.showZ1Subjects = $event.value;
  }
}
