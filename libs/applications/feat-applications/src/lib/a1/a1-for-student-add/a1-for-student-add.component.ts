import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { A1FormComponent } from '../a1-form/a1-form.component';
import { ActivatedRoute } from '@angular/router';
import { A1FormModeEnum } from '../a1-form-mode.enum';

@Component({
  selector: 'msh-a1-for-student-add',
  standalone: true,
  templateUrl: './a1-for-student-add.component.html',
  styleUrls: ['./a1-for-student-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, A1FormComponent],
  providers: [],
})
export class A1ForStudentAddComponent {
  id = '';
  studentId = '';

  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.studentId = this.route.snapshot.paramMap.get('studentId') ?? '';
  }

  protected readonly A1FormModeEnum = A1FormModeEnum;
}
