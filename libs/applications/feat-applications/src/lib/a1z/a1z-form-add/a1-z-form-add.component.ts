import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { A1zFormComponent } from '../a1z-form/a1z-form.component';
import {ActivatedRoute} from "@angular/router";
import {A1ZFormModeEnum} from "../a1z-form-mode.enum";

@Component({
  selector: 'msh-a1z-form-add',
  standalone: true,
  templateUrl: './a1-z-form-add.component.html',
  styleUrls: ['./a1-z-form-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, A1zFormComponent],
  providers: [],
})
export class A1ZFormAddComponent {
  id = '';
  studentId = '';

  constructor(private  route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.studentId = this.route.snapshot.paramMap.get('studentId') ?? '';
  }

  protected readonly A1ZFormModeEnum = A1ZFormModeEnum;
}
