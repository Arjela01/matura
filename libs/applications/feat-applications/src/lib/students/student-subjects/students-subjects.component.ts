import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { ExamSubject } from '@msh/shared/domain-models';
import { ColumnFilterDirective } from '@msh/shared/util-shared';

@Component({
  selector: 'msh-students-subjects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    RadioButtonModule,
    ButtonModule,
    RouterLink,
    ColumnFilterDirective,
  ],
  templateUrl: './students-subjects.component.html',
  styleUrls: ['./students-subjects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsSubjectsComponent {
  @Input() subjects!: ExamSubject[];
}
