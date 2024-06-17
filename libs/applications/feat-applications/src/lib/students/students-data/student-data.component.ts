import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { A1ZTableRecord } from '@msh/applications/domain-application';
import { Student } from '@msh/shared/domain-models';
import { UntilDestroy } from '@ngneat/until-destroy';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AppDatePipe } from '@msh/shared/ui-shared';

@UntilDestroy()
@Component({
  selector: 'msh-students-data',
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
    CalendarModule,
    InputMaskModule,
    RouterLink,
    DatePipe,
    AppDatePipe,
  ],
  providers: [DatePipe],
  templateUrl: './student-data.component.html',
  styleUrls: ['./student-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDataComponent {
  @Input() showStudent = false;
  @Input() student!: Student;
  @Input() forms: A1ZTableRecord[] = [];
  @Input() finishedAtSameSchool = true;
}
