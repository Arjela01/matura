import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'msh-exam-version-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-version-form.component.html',
  styleUrls: ['./exam-version-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamVersionFormComponent {}
