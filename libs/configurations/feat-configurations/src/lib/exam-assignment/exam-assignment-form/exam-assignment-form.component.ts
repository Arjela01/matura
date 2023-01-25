import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'msh-exam-assignment-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-assignment-form.component.html',
  styleUrls: ['./exam-assignment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamAssignmentFormComponent {}
