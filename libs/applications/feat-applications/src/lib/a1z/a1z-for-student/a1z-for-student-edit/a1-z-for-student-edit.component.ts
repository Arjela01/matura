import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {A1Z} from "@msh/applications/domain-application";

@Component({
  selector: 'msh-a1z-for-student-edit',
  standalone: true,
  templateUrl: './a1z-for-student-edit.component.html',
  styleUrls: ['./a1z-for-student-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [],
})
export class A1ZForStudentEditComponent {
  @Output() formSave = new EventEmitter<A1Z>();
  @Output() formClose = new EventEmitter<undefined>();
}
