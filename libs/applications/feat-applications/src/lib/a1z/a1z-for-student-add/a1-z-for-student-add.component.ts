import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { A1Z } from '@msh/applications/domain-application';
import { A1zFormComponent } from '../a1z-form/a1z-form.component';
import { ActivatedRoute } from '@angular/router';
import { A1ZFormModeEnum } from '../a1z-form-mode.enum';

@Component({
  selector: 'msh-a1-z-for-student-add',
  standalone: true,
  templateUrl: './a1-z-for-student-add.component.html',
  styleUrls: ['./a1-z-for-student-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, A1zFormComponent],
  providers: [],
})
export class A1ZForStudentAddComponent {
  id = '';
  studentId = '';

  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.studentId = this.route.snapshot.paramMap.get('studentId') ?? '';
  }

  protected readonly A1ZFormModeEnum = A1ZFormModeEnum;
}
