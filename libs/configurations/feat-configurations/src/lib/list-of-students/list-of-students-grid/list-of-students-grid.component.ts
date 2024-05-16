import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamAssignment } from '@msh/shared/domain-models';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';

@Component({
  selector: 'msh-list-of-students-grid',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    ColumnFilterDirective,
    TableModule,
  ],
  templateUrl: './list-of-students-grid.component.html',
  styleUrls: ['./list-of-students-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfStudentsGridComponent {
  @Input() studentsList: ExamAssignment[] = [];
  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  formatStudentData(student: ExamAssignment): {
    firstName: string;
    middleName: string;
    lastName: string;
    formattedExamTypeDateTime: string;
  } {
    const names = student.studentName.split(' ');
    const firstName = names[0];
    const middleName = names[1];
    const lastName = names.slice(2).join(' ');
    const formattedExamTypeDateTime = this.formatExamTypeDateTime(
      student.examTypeDateTime as any
    );
    return { firstName, middleName, lastName, formattedExamTypeDateTime };
  }

  formatExamTypeDateTime(dateTime: string): string {
    const [typePart, datePart, timePart] = dateTime.split(' ');
    return `${typePart} - ${datePart} @ ${timePart}`;
  }
  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
