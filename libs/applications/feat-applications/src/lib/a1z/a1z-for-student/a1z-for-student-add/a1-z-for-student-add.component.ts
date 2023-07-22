import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {A1Z} from "@msh/applications/domain-application";

@Component({
  selector: 'msh-a1-z-for-student-add',
  standalone: true,
  templateUrl: './a1z-for-student-add.component.html',
  styleUrls: ['./a1z-for-student-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [],
})
export class A1ZForStudentAddComponent {
  @Output() formSave = new EventEmitter<A1Z>();
  @Output() formClose = new EventEmitter<undefined>();
}
