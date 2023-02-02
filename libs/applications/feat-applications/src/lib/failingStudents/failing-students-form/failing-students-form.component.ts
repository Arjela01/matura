/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
import { FailingStudentApiService } from '@msh/applications/data-access-applications';
import { FailingStudent } from '@msh/applications/domain-applications';
import { GlobalToastService } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
@UntilDestroy()
@Component({
  selector: 'msh-failing-students-form',
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
  templateUrl: './failing-students-form.component.html',
  styleUrls: ['./failing-students-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FailingStudentsFormComponent implements OnInit {
  constructor(
    private cd: ChangeDetectorRef,
    private readonly failingStudentService: FailingStudentApiService,
    private readonly toastService: GlobalToastService
  ) {}
  @Input() set failingStudentDetails(details: FailingStudent | null) {
    if (details) {
      this.failingStudent = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<FailingStudent>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  ngOnInit(): void {
    console.log('Form init');
    this.getFailingStudentById(this.failingStudent.id!);
  }

  submitted = false;

  failingStudent: FailingStudent = {
    id: 0,
    subject: undefined,
    studentId: undefined,
  };

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.failingStudent);
    }
  }

  getFailingStudentById(studentId: number) {
    this.failingStudentService
      .getOne(studentId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful === true) {
          this.failingStudent = response.data;
          this.cd.detectChanges();
        }

        if (response.isSuccessful === false) {
          this.toastService.showError(
            'Ndodhi nje problem gjatë kerkimit te studentit mbetes!'
          );
        }
      });
  }
}
