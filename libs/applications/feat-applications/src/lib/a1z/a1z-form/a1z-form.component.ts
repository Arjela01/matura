import { A1Z } from '../../../../../domain-applications/a1z/a1z.model';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { A1ZApiService } from '@msh/applications/data-access-applications';
import {
  A1ZCategoryApiService,
  AcademicYearApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { A1zStudentSearchComponent } from '../a1z-student-search/a1z-student-search.component';

@Component({
  selector: 'msh-a1z-form',
  standalone: true,
  templateUrl: './a1z-form.component.html',
  styleUrls: ['./a1z-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    ConfirmDialogModule,
    CalendarModule,
    DropdownModule,
    A1zStudentSearchComponent,
  ],
})
export class A1zFormComponent implements OnInit, OnChanges, DoCheck {
  //TODO: Add logic for single form edit details

  @Output() formSave = new EventEmitter<A1Z>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;
  academicYears: DropdownModel<number>[] = [];
  a1Categories: DropdownModel<number>[] = [];

  selectedStudent: any = null;

  students = [
    {
      id: 1,
      studentFirstName: 'Rei',
      studentLastName: 'Ikonomi',
      studentFatherName: 'Tomash',
      nid: 'K232333320b',
    },
    {
      id: 2,
      studentFirstName: 'Testing',
      studentLastName: 'Testing1',
      studentFatherName: 'Testing2',
      nid: 'A2656721762g',
    },
  ];

  showStudentModal = false;

  disableD1Subject = false;
  disableD2Subject = false;
  disableD3Subject = false;

  submitted = false;

  a1z: A1Z = {
    id: 0,
    academicYearId: 0,
    studentInputData: '',
    isApplyingToForeignCountries: false,
    a1ZCategoryId: '',
    alreadyHaveDiploma: true,
    carriedGradeAZ1: 0,
    carriedGradeD1: 0,
    carriedGradeD2: 0,
    carriedGradeD3: 0,
    carriedReasonAZ1: '',
    carriedReasonD1: '',
    carriedReasonD2: '',
    carriedReasonD3: '',
    carriedSubjectAZ1: '',
    carriedSubjectD1: '',
    carriedSubjectD2: '',
    carriedSubjectD3: '',
    noCarriedSubjets: 0,
    noCarriedSubjetsZ: 0,
    isA1: false,
    overSeerCode: '',
    studentId: '0867D567-E31A-4600-3464-08DAFB019942',
    subjectD1: '',
    subjectD2: '',
    subjectD3: '',
    subjectZ1: '',
    yearOfSchoolA1Z: 0,
    yearZ1: 0,
  };

  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      this.a1zService.save(this.a1z).subscribe(response => {
        console.log(response);
      });
    }
    this.a1zService.save(this.a1z).subscribe(response => {
      console.log(response.data);
    });
    console.log(this.a1z);
  }

  constructor(
    private cd: ChangeDetectorRef,
    private readonly academicYearService: AcademicYearApiService,
    private readonly a1CategoryService: A1ZCategoryApiService,
    private readonly a1zService: A1ZApiService
  ) {}

  ngDoCheck(): void {
    if (this.a1z.noCarriedSubjets !== 4) {
      this.onNeededSubjectChange({
        value: this.a1z,
      });
    }
    if (
      this.a1z.studentInputData !== '' ||
      this.a1z.studentInputData.length === 0
    ) {
      this.onStudentChange(this.selectedStudent);
    }
  }

  ngOnInit(): void {
    this.academicYearService.loadDropdownList().subscribe(response => {
      this.academicYears = response.data;
    });
    this.a1CategoryService.loadDropdownList().subscribe(response => {
      this.a1Categories = response.data;
    });
    console.log('init');
  }

  ngOnChanges(): void {
    this.onNeededSubjectChange({
      value: this.a1z.noCarriedSubjets,
    });
  }

  onGridEvent(event: GridEvent<any | any[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.selectedStudent = Object.assign({}, event.data);
        console.log(event.data);
        this.showStudentModal = false;
        break;
    }
  }

  onStudentChange(event: any) {
    if (!event) {
      this.a1z.studentInputData = ' ';
    } else {
      this.a1z.studentId = event.id;
      this.a1z.studentInputData =
        event?.nid +
        '-' +
        event?.studentFirstName +
        '-' +
        event?.studentFatherName +
        '-' +
        event?.studentLastName;
    }
  }

  onSubjectD1Change($event: any) {
    this.disableD1Subject =
      ($event.value.noCarriedSubjets === 1 &&
        $event.value.carriedSubjectD2 !== '') ||
      $event.value.carriedSubjectD3 !== '' ||
      $event.value.noCarriedSubjets === 0;
  }

  onSubjectD2Change($event: any) {
    this.disableD2Subject =
      ($event.value.noCarriedSubjets === 1 &&
        $event.value.carriedSubjectD1 !== '') ||
      $event.value.carriedSubjectD3 !== '' ||
      $event.value.noCarriedSubjets === 0;
  }

  onSubjectD3Change($event: any) {
    this.disableD3Subject =
      ($event.value.noCarriedSubjets === 1 &&
        $event.value.carriedSubjectD2 !== '') ||
      $event.value.carriedSubjectD1 !== '' ||
      $event.value.noCarriedSubjets === 0;
  }

  onNeededSubjectChange($event: any) {
    this.onSubjectD1Change($event);
    this.onSubjectD2Change($event);
    this.onSubjectD3Change($event);

    if ($event.value.noCarriedSubjets === 3) {
      this.disableD1Subject = false;
      this.disableD2Subject = false;
      this.disableD3Subject = false;
    }

    // There was a problem when disabling the input fields if radio button nr 2 was selected. The logic above didn't work in that case.
    if ($event.value.noCarriedSubjets === 2) {
      if (
        $event.value.carriedSubjectD2 !== '' &&
        $event.value.carriedSubjectD3 !== ''
      ) {
        this.disableD1Subject = true;
      } else {
        this.disableD1Subject = false;
      }
      if (
        $event.value.carriedSubjectD1 !== '' &&
        $event.value.carriedSubjectD3 !== ''
      ) {
        this.disableD2Subject = true;
      } else {
        this.disableD2Subject = false;
      }
      if (
        $event.value.carriedSubjectD1 !== '' &&
        $event.value.carriedSubjectD2 !== ''
      ) {
        this.disableD3Subject = true;
      } else {
        this.disableD3Subject = false;
      }
    }
  }

  onStudentShow() {
    this.showStudentModal = true;
  }

  onStudentHide() {
    this.showStudentModal = false;
  }
}
