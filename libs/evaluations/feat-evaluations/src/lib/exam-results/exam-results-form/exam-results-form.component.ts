import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'msh-exam-results-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-results-form.component.html',
  styleUrls: ['./exam-results-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamResultsFormComponent {}
