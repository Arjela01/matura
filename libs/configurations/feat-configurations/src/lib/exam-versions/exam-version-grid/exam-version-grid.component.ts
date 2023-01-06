import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'msh-exam-version-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-version-grid.component.html',
  styleUrls: ['./exam-version-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamVersionGridComponent {}
