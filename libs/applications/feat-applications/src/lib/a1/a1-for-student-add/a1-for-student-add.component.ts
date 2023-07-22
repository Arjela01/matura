import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { A1Z } from '@msh/applications/domain-application';
import {A1FormComponent} from "../a1-form/a1-form.component";

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
  @Output() formSave = new EventEmitter<A1Z>();
  @Output() formClose = new EventEmitter<undefined>();
}
