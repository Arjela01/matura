import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {A1Z} from "@msh/applications/domain-application";
import {A1zFormComponent} from "../a1z-form/a1z-form.component";
import {ActivatedRoute} from "@angular/router";
import {A1ZFormModeEnum} from "../a1z-form-mode.enum";

@Component({
  selector: 'msh-a1z-for-student-edit',
  standalone: true,
  templateUrl: './a1-z-for-student-edit.component.html',
  styleUrls: ['./a1-z-for-student-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    A1zFormComponent,
  ],
  providers: [],
})
export class A1ZForStudentEditComponent {
  id = '';
  studentId = '';

  constructor(private  route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.studentId = this.route.snapshot.paramMap.get('studentId') ?? '';
  }

  protected readonly A1ZFormModeEnum = A1ZFormModeEnum;
}
