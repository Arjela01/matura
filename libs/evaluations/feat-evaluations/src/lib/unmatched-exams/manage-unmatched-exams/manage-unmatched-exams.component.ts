import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'msh-manage-unmatched-exams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-unmatched-exams.component.html',
  styleUrls: ['./manage-unmatched-exams.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageUnmatchedExamsComponent {}
