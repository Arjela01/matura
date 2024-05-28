import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { ExamScore } from '@msh/shared/domain-models';
import { ColumnFilterDirective } from '@msh/shared/util-shared';

@Component({
  selector: 'msh-students-audit--scores',
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
  templateUrl: './students-audit-scores.component.html',
  styleUrls: ['./students-audit-scores.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentAuditScoresComponent {
  @Input() scores: ExamScore[] = [];
}
