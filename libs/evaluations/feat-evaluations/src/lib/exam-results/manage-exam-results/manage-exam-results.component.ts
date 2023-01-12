import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'msh-manage-exam-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-exam-results.component.html',
  styleUrls: ['./manage-exam-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageExamResultsComponent {}
