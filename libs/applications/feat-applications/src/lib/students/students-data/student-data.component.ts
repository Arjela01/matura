import { CommonModule } from '@angular/common';
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
  ],
  templateUrl: './student-data.component.html',
  styleUrls: ['./student-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDataComponent {
  @Input() showStudent = false;
  @Input() student!: Student;
  @Input() forms: A1ZTableRecord[] = [];
  @Input() finishedAtSameSchool = true;
  showEditButton = false;

  constructor(private router: Router) {}

  navigateToForm(a1: A1ZTableRecord) {
    let routePath: string;

    if (this.showEditButton) {
      if (a1.isA1) {
        routePath = `/applications/a1/for-student/${this.student?.id}/edit/${a1.id}`;
      } else {
        routePath = `/applications/a1z/for-student/${this.student?.id}/edit/${a1.id}`;
      }
    } else {
      if (a1.isA1) {
        routePath = `/applications/a1/view/${a1.id}`;
      } else {
        routePath = `/applications/a1z/view/${a1.id}`;
      }
    }

    this.router.navigate([routePath]);
  }
}
