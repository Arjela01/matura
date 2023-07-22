import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {A1Z} from "@msh/applications/domain-application";
import {A1zFormComponent} from "../a1z-form/a1z-form.component";

@Component({
  selector: 'msh-a1-z-for-student-add',
  standalone: true,
  templateUrl: './a1-z-for-student-add.component.html',
  styleUrls: ['./a1-z-for-student-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    A1zFormComponent,
  ],
  providers: [],
})
export class A1ZForStudentAddComponent {
  @Output() formSave = new EventEmitter<A1Z>();
  @Output() formClose = new EventEmitter<undefined>();
}
