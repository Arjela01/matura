import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ExamGrade } from '@msh/shared/domain-models';
import { ColumnFilterDirective } from '@msh/shared/util-shared';

@Component({
  selector: 'msh-student-audit-grades',
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
    ColumnFilterDirective,
  ],
  templateUrl: './student-audit-grades.component.html',
  styleUrls: ['./student-audit-grades.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentAuditGradesComponent {
  @Input() grades!: ExamGrade[];
}
