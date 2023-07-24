import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageDiplomasStudentComponent } from '../manage-diplomas-student/manage-diplomas-student.component';

@Component({
  selector: 'msh-printed-diplomas',
  standalone: true,
  imports: [CommonModule, ManageDiplomasStudentComponent],
  templateUrl: './printed-diplomas.component.html',
  styleUrls: ['./printed-diplomas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrintedDiplomasComponent {}
