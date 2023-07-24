import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { A1Z } from '@msh/applications/domain-application';
import { A1FormComponent } from '../a1-form/a1-form.component';
import { A1FormModeEnum } from '../a1-form-mode.enum';

@Component({
  selector: 'msh-a1-form-add',
  standalone: true,
  templateUrl: './a1-form-add.component.html',
  styleUrls: ['./a1-form-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, A1FormComponent],
  providers: [],
})
export class A1FormAddComponent {
  @Output() formSave = new EventEmitter<A1Z>();
  @Output() formClose = new EventEmitter<undefined>();
  protected readonly A1FormModeEnum = A1FormModeEnum;
}
