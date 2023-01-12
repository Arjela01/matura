import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'msh-exam-results-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-results-grid.component.html',
  styleUrls: ['./exam-results-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamResultsGridComponent {}
