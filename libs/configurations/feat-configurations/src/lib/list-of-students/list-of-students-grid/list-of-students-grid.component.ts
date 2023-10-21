import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamAssignment } from '@msh/shared/domain-models';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'msh-list-of-students-grid',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './list-of-students-grid.component.html',
  styleUrls: ['./list-of-students-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfStudentsGridComponent implements OnChanges {
  @Input() studentsList: ExamAssignment[] = [];
  @Input() totalRecords = 0;
  firstName = '';
  middleName = '';
  lastName = '';

  ngOnChanges() {
    this.studentsList.forEach(student => {
      const names = student.studentName.split(' ');
      this.firstName = names[0];
      this.middleName = names[1];
      this.lastName = names.slice(2).join(' ');
    });
  }
}
