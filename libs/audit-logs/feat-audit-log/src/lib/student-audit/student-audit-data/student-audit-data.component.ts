import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { RouterLink } from '@angular/router';
import { Student } from '@msh/shared/domain-models';
import { AppDatePipe } from '@msh/shared/ui-shared';

@Component({
  selector: 'msh-student-audit-data',
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
    RouterLink,
    DatePipe,
    AppDatePipe,
  ],
  providers: [DatePipe],
  templateUrl: './student-audit-data.component.html',
  styleUrls: ['./student-audit-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentAuditDataComponent {
  @Input() finishedAtSameSchool = true;
  @Input() student!: Student;
}
