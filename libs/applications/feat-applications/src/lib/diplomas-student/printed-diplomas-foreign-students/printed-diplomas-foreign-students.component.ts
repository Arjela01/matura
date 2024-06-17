import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageDiplomasStudentComponent } from '../manage-diplomas-student/manage-diplomas-student.component';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-printed-diplomas-foreign-students',
  standalone: true,
  imports: [
    CommonModule,
    ManageDiplomasStudentComponent,
    ColumnFilterDirective,
    SharedModule,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './printed-diplomas-foreign-students.component.html',
  styleUrls: ['./printed-diplomas-foreign-students.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrintedDiplomasForeignStudentsComponent {}
